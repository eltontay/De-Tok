// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./DTok.sol";
import "./DVid.sol";

contract DeTok is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _videoIdCounter;

    // 3 Video Types
    enum VideoType {
        BASIC,
        TRENDING
    }

    // Constants
    uint256 private constant BASIC_VIEWS_THRESHOLD = 100; // dyanmic with default values
    uint256 private constant TRENDING_VIEWS_THRESHOLD = 1000000; // dynamic with default values
    uint256 private constant CLAIMABLE_TOKEN = 100; // fixed initial claimable amount
    uint256 private constant DEFAULT_STORAGE_WINDOW = 15; // dyanmic with default values

    // Mapping
    mapping(uint256 => VideoRecord) private _basicVideos; // basic video collection
    mapping(uint256 => VideoRecord) private _trendingVideos; // trendy video collection
    mapping(address => VideoRecord[]) private _ownerBasicVideos; // owner basic video collection
    mapping(address => VideoRecord[]) private _ownerTrendingVideos; // owner trend video collection
    mapping(address => bool) private _claimedAddress; // track claimed tokens to address

    // Video Record Structure
    struct VideoRecord {
        address owner;
        uint256 videoId;
        string cid;
        uint256 views;
        bool exist;
        VideoType videoType;
    }

    struct Users {
        address user;
        string web3api;
    }

    DTok private _dtok; // DTok ERC20 Token
    DVid private _dvid; // DVid ERC721 Token

    constructor(DTok dtok_, DVid dvid_) {
        _dtok = dtok_;
        _dvid = dvid_;
    }

    // Registered De-Tok user can claim 100 DTOK Tokens
    function claimToken() public payable checkClaimed(msg.sender) {
        _claimedAddress[msg.sender] = true;
        _dtok.transfer(msg.sender, CLAIMABLE_TOKEN);
    }

    // Mint Video in
    function mintVideo(
        VideoType videoType,
        string memory uri,
        string memory cid
    ) public returns (uint256 videoId) {
        videoId = _videoIdCounter.current();
        _videoIdCounter.increment();
        _dvid.safeMint(msg.sender, videoId, uri);

        // Create Video record
        VideoRecord memory videoRecord = VideoRecord(msg.sender, videoId, cid, 0, false, videoType);

        // Storing mapping
        if (videoType == VideoType.BASIC) {
            _basicVideos[videoId] = videoRecord;
            _ownerBasicVideos[msg.sender].push(videoRecord);
        } else {
            _trendingVideos[videoId] = videoRecord;
            _ownerTrendingVideos[msg.sender].push(videoRecord);
        }
    }

    // // Viewing functions
    // function freeView(uint256 tokenId) public returns (VideoRecord memory) {
    //     require(
    //         s_tokenToVideoRecords[tokenId].videoType == VideoType.FREE,
    //         "Sorry, it is not a free video"
    //     );
    //     s_tokenToVideoRecords[tokenId].views = s_tokenToVideoRecords[tokenId].views + 1;

    //     if (s_tokenToVideoRecords[tokenId].views > BASIC_VIEWS_THRESHOLD) {
    //         // if it was free, now it is going to be paid one
    //         s_tokenToVideoRecords[tokenId].videoType = VideoType.PAID;
    //     }

    //     return s_tokenToVideoRecords[tokenId];
    // }

    // function payAndView(uint256 tokenId) public payable returns (VideoRecord memory) {
    //     require(
    //         s_tokenToVideoRecords[tokenId].videoType == VideoType.PAID,
    //         "pls check again the video"
    //     );

    //     // make payment
    //     (bool sent, ) = address(this).call{value: msg.value}("");
    //     require(sent, "Failed to pay, dont you have enough balance");
    //     s_tokenToVideoRecords[tokenId].views = s_tokenToVideoRecords[tokenId].views + 1;

    //     if (s_tokenToVideoRecords[tokenId].views > BASIC_VIEWS_THRESHOLD) {
    //         // if it was free, now it is going to be paid one
    //         s_tokenToVideoRecords[tokenId].videoType = VideoType.PAID;
    //     }
    //     return s_tokenToVideoRecords[tokenId];
    // }

    // function fundedView(uint256 tokenId) public payable returns (VideoRecord memory) {
    //     require(
    //         s_tokenToVideoRecords[tokenId].videoType == VideoType.FUNDED,
    //         "pls check again the video"
    //     );

    //     // make payment from author account to smart contract
    //     s_tokens.transferFrom(s_tokenToVideoRecords[tokenId].owner, address(this), 1);
    //     s_tokenToVideoRecords[tokenId].views = s_tokenToVideoRecords[tokenId].views + 1;
    //     return s_tokenToVideoRecords[tokenId];
    // }

    // function getFundBalance() public view returns (uint256) {
    //     return s_ownerAvailableFunds[msg.sender];
    // }

    // function getOwnerCollection() public view returns (VideoRecord[] memory) {
    //     return s_ownerVideoRecords[msg.sender];
    // }

    // function getFreeVideos() public view returns (VideoRecord[] memory) {
    //     uint256 freeVideoCount = 0;
    //     VideoRecord[] memory tmp = new VideoRecord[](s_videoCollection.length);

    //     // create a list of free
    //     for (uint256 tokenIndex = 1; tokenIndex <= s_videoCollection.length; tokenIndex++) {
    //         if (s_videoCollection[tokenIndex].videoType == VideoType.FREE) {
    //             tmp[freeVideoCount] = s_videoCollection[tokenIndex];
    //             freeVideoCount += 1;
    //         }
    //     }

    //     // return only free videos
    //     VideoRecord[] memory freeVideos = new VideoRecord[](freeVideoCount);
    //     for (uint256 i = 0; i < freeVideoCount; i++) {
    //         freeVideos[i] = tmp[i];
    //     }
    //     return freeVideos;
    // }

    // function getFundedVideos() public view returns (VideoRecord[] memory) {
    //     uint256 fundedVideoCount = 0;
    //     VideoRecord[] memory tmp = new VideoRecord[](s_videoCollection.length);

    //     // create a list of Funded
    //     for (uint256 tokenIndex = 1; tokenIndex <= s_videoCollection.length; tokenIndex++) {
    //         if (s_videoCollection[tokenIndex].videoType == VideoType.FUNDED) {
    //             tmp[fundedVideoCount] = s_videoCollection[tokenIndex];
    //             fundedVideoCount += 1;
    //         }
    //     }

    //     // return only Funded videos
    //     VideoRecord[] memory fundedVideos = new VideoRecord[](fundedVideoCount);
    //     for (uint256 i = 0; i < fundedVideoCount; i++) {
    //         fundedVideos[i] = tmp[i];
    //     }
    //     return fundedVideos;
    // }

    // function getPayToViewVideos() public view returns (VideoRecord[] memory) {
    //     uint256 paidVideoCount = 0;
    //     VideoRecord[] memory tmp = new VideoRecord[](s_videoCollection.length);

    //     // create a list of Funded
    //     for (uint256 tokenIndex = 1; tokenIndex <= s_videoCollection.length; tokenIndex++) {
    //         if (s_videoCollection[tokenIndex].videoType == VideoType.PAID) {
    //             tmp[paidVideoCount] = s_videoCollection[tokenIndex];
    //             paidVideoCount += 1;
    //         }
    //     }

    //     // return only Funded videos
    //     VideoRecord[] memory paidVideos = new VideoRecord[](paidVideoCount);
    //     for (uint256 i = 0; i < paidVideoCount; i++) {
    //         paidVideos[i] = tmp[i];
    //     }
    //     return paidVideos;
    // }

    modifier checkClaimed(address _address) {
        require(_claimedAddress[_address] == false, "You have already claimed");
        _;
    }

    modifier checkBasic(uint256 videoId) {
        require(_basicVideos[videoId].exist, "This is not a basic video");
        _;
    }
}
