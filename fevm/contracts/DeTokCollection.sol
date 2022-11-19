// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./DeTokCoin.sol";
import "./DeTokVideo.sol";

contract DeTokCollection is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Data type definitions
    enum VideoType {
        FREE,  // Any one can view
        PAID,  // Pay and view
        FUNDED // Funded by the owner to view. free for user
    }

    enum Category {
        BASIC,
        TRENDING 
    }

    struct VideoRecord {
        uint256   tokenId;
        address   owner;
        uint256   postedOn;
        uint256   views;
        VideoType videoType; 
        uint256   expiresOn;
        string    tokenURI;    
        uint256   dealId;
        bool      isDeleted; 
        Category  category;   
    }

    // Constants
    uint constant BASIC_VIEWS = 100;
    uint constant TRENDING_VIEWS = 1000;
    uint constant CLAIMABLE_TOKEN = 100;   
    uint constant DEFAULT_STORAGE_WINDOW = 15;   

    uint constant MAX_CLAIMABLE = 10000000;   

    uint256 private s_claimableTokens = 0;

    // Storage variable
    DeTokCoin private s_tokens;
    DeTokVideo private s_mediaRecs;

    VideoRecord[] private s_videoCollection;

    // Token Id to Media Record mapping
    mapping(uint256=>VideoRecord) private s_tokenToVideoRecords; 

    // Owner to Media Records mapping
    mapping(address=>VideoRecord[]) private s_ownerVideoRecords;

    // Viewer permissioned Media records
    mapping(address=>VideoRecord[]) private s_viewerPermissionedVideoRecords;

    // free erc20 tokens claimed - tracking
    mapping(address=>bool) private s_claimedTokens;  

    constructor(DeTokCoin coin, DeTokVideo video){
        s_tokens = coin;
        s_mediaRecs = video;
    }

    function isClaimable() public view returns(bool canClaim){
        if(s_claimedTokens[msg.sender] == true)
        {
            canClaim = false;
        }

        if(s_claimableTokens >= MAX_CLAIMABLE)
        {
            canClaim = false;
        }

        if(s_claimableTokens <= CLAIMABLE_TOKEN)
        {
            canClaim = false;
        }
    }

    // Every user who connects to DeTok gets certain ERC20 tokens which he/she can claim
    function claimToken() public {
        require(s_claimedTokens[msg.sender] == true,"already claimed");
        require(s_claimableTokens >= MAX_CLAIMABLE, "Sorry, free claimable coins are distributed already");
    
        require(s_claimableTokens <= CLAIMABLE_TOKEN, "Not enough tokens in the reserve");
  
        s_tokens.transfer(msg.sender,CLAIMABLE_TOKEN);  
        s_claimedTokens[msg.sender] =true;
    }

    // Any user can post a Video
    function postDeTokVideo(VideoType videoType, string memory uri) public payable returns(uint256 tokenId){
         tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        s_mediaRecs.safeMint(msg.sender, tokenId,uri);    

        if(videoType == VideoType.FUNDED) {
           // transfer funds to the smart contract
           s_tokens.transferFrom(msg.sender, address(this), msg.value);
           (bool sent,) = address(this).call{value: msg.value}("");
           require(sent, "Failed to pay, dont you have enough balance");
        }

        // Create Video record
        VideoRecord memory videoRecord = VideoRecord(tokenId,msg.sender,block.timestamp,0,videoType,block.timestamp + (24*60*60*DEFAULT_STORAGE_WINDOW),uri, 0, false, Category.BASIC);
        
        // Store 
        s_tokenToVideoRecords[tokenId] = videoRecord;
        s_videoCollection.push(videoRecord);

        // Owner will have permission to view
        s_viewerPermissionedVideoRecords[msg.sender].push(videoRecord);

        // Owner collection
        s_ownerVideoRecords[msg.sender].push(videoRecord);
    }

    // Viewing functions
    function freeView(uint256 tokenId) public returns (VideoRecord memory){
        bool isFree = s_tokenToVideoRecords[tokenId].videoType == VideoType.FREE;
        bool isFunded = s_tokenToVideoRecords[tokenId].videoType == VideoType.FUNDED;

        require(isFree || isFunded,"Sorry, it is not a free video");
        s_tokenToVideoRecords[tokenId].views =  s_tokenToVideoRecords[tokenId].views + 1;

        if(s_tokenToVideoRecords[tokenId].views > BASIC_VIEWS){
            // if it was free, now it is going to be paid one
            if(s_tokenToVideoRecords[tokenId].videoType == VideoType.FREE){
                s_tokenToVideoRecords[tokenId].videoType = VideoType.PAID;
            }
        }

        if(s_tokenToVideoRecords[tokenId].views > TRENDING_VIEWS){
            s_tokenToVideoRecords[tokenId].category = Category.TRENDING; 
        }

        return s_tokenToVideoRecords[tokenId];
    }

    function payAndView(uint256 tokenId) public payable returns (VideoRecord memory){
        require(s_tokenToVideoRecords[tokenId].videoType == VideoType.PAID,"pls check again the video");

        // make payment
        (bool sent,) = address(this).call{value: msg.value}("");
        require(sent, "Failed to pay, dont you have enough balance");
        s_tokenToVideoRecords[tokenId].views =  s_tokenToVideoRecords[tokenId].views + 1;

        if(s_tokenToVideoRecords[tokenId].views > BASIC_VIEWS){
            // if it was free, now it is going to be paid one
            s_tokenToVideoRecords[tokenId].videoType = VideoType.PAID;
        }
        return s_tokenToVideoRecords[tokenId];
    }

    function fundedView(uint256 tokenId) public payable returns (VideoRecord memory){
        require(s_tokenToVideoRecords[tokenId].videoType == VideoType.FUNDED,"pls check again the video");   

         // make payment from author account to smart contract
        s_tokens.transferFrom(s_tokenToVideoRecords[tokenId].owner,address(this),1);
        s_tokenToVideoRecords[tokenId].views =  s_tokenToVideoRecords[tokenId].views + 1;
        return s_tokenToVideoRecords[tokenId];
    }

    function preFundDeposit() public payable {
        // add prefund to existing funds 
        require(s_tokens.balanceOf(msg.sender) > msg.value,"Insufficient balance");

        // approve the amount of funds
        s_tokens.approve(address(this),msg.value); 
    }

    function getFundBalance() public view returns(uint256){
        return s_tokens.allowance(msg.sender, address(this));
    }
    
    function getOwnerCollection()public view returns(VideoRecord[] memory){
        return s_ownerVideoRecords[msg.sender];
    }

    function getBasicVideos() public view returns(VideoRecord[] memory){
       uint256 basicVideoCount = 0;
       VideoRecord[] memory tmp = new VideoRecord[](s_videoCollection.length);

       // create a list of free
       for(uint tokenIndex =1; tokenIndex <= s_videoCollection.length; tokenIndex++){
          if(s_videoCollection[tokenIndex].category == Category.BASIC) 
            {
             tmp[basicVideoCount] = s_videoCollection[tokenIndex];
             basicVideoCount +=1;
          }
       }

       // return only basic videos 
       VideoRecord[] memory basicVideos = new VideoRecord[](basicVideoCount);
       for(uint i =0; i < basicVideoCount; i++){
           basicVideos[i] = tmp[i];
       }
       return basicVideos;
    }


    function getTrendingVideos() public view returns(VideoRecord[] memory){
        uint256 trendingVideoCount = 0;
       VideoRecord[] memory tmp = new VideoRecord[](s_videoCollection.length);

       // create a list of free
       for(uint tokenIndex =1; tokenIndex <= s_videoCollection.length; tokenIndex++){
           if(s_videoCollection[tokenIndex].category == Category.TRENDING){
             tmp[trendingVideoCount] = s_videoCollection[tokenIndex];
             trendingVideoCount +=1;
          }
       }

       // return only free videos 
       VideoRecord[] memory trendingVideos = new VideoRecord[](trendingVideoCount);
       for(uint i =0; i < trendingVideoCount; i++){
           trendingVideos[i] = tmp[i];
       }
       return trendingVideos;
    }
}