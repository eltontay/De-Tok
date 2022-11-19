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
    enum viewMode {
        FREE,
        PAID 
    }

    enum classification {
        BASIC,
        MASTER 
    }

    struct MediaRecord {
        uint256   tokenId;
        address   owner;
        uint256   postedOn;
        uint256   views;
        viewMode  mode; 
        uint256   expiresOn;
        string    tokenURI;    
        uint256   dealId;
        bool      isDeleted;     
    }

    // Constants
    uint constant BASIC_VIEWS = 100;
    uint constant MASTER_VIEWS = 1000000;
    uint constant CLAIMABLE_TOKEN = 100;   

    // Storage variable
    DeTokCoin private s_tokens;
    DeTokVideo private s_mediaRecs;

    // Videos in Basic collection
    MediaRecord[] private s_basicCollection;

    // Master Collection
    MediaRecord[] private s_masterCollection;

    // Token Id to Media Record mapping
    mapping(uint256=>MediaRecord) private s_tokenToMediaRecords; 
    // Owner to Media Records mapping
    mapping(address=>MediaRecord[]) private s_ownerMediaRecords;

    // Viewer permissioned Media records
    mapping(address=>MediaRecord[]) private s_viewerPermissionedMediaRecords;

    // free erc20 tokens claimed - tracking
    mapping(address=>bool) private s_claimedTokens;  

    constructor(DeTokCoin coin, DeTokVideo video){
        s_tokens = coin;
        s_mediaRecs = video;
    }

    // Every user who connects to DeTok gets certain ERC20 tokens which he/she can claim
    function claimToken() public payable {

    }

    // Any user can post a view
    function postDeTokVideo(string memory uri) public returns(uint256 tokenId){
            
    }


    function freeView(uint256 tokenId) public returns (MediaRecord memory){

    }

    function payAndView(uint256 tokenId) public payable returns (MediaRecord memory){

    }


    // internal function to elevate as paid
    // internal function to evevate as master

    

}