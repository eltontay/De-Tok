// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./DTok.sol";
import "./DVid.sol";

contract DeTok is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _videoIdCounter;

    // 2 Video Types, values are 0 and 1 respectively
    enum VideoType {
        BASIC,
        TRENDING
    }

    // Constants
    uint256 private constant TRENDING_VIEWS_THRESHOLD = 10; // dynamic with default value, setting to 10 for testing purposes
    uint256 private constant CLAIMABLE_TOKEN = 100; // fixed initial claimable amount
    uint256 private constant DEFAULT_STORAGE_WINDOW = 15; // dyanmic with default values
    uint256 private constant DEFAULT_PRICE = 1 * 10 * 18; // 1 DTOK with 18 decimals

    // Mapping
    mapping(uint256 => VideoType) private _videoType; // video id to video type
    mapping(uint256 => VideoRecord) private _basicVideos; // basic video collection
    mapping(uint256 => VideoRecord) private _trendingVideos; // trendy video collection
    mapping(address => uint256) private _videoCounter; // counter for number of videos for each video owner
    mapping(address => mapping(uint256 => uint256)) private _videoOwners; // owner to index to video ids
    mapping(address => bool) private _claimedAddress; // track claimed tokens to address

    // Video Record Structure
    struct VideoRecord {
        address owner;
        string cid;
        uint256 views;
        bool exist;
        bool payableVideo;
        uint256 payableThreshold;
    }

    struct Users {
        address user;
        string web3api;
    }

    DTok private _dtok; // DTok ERC20 Token
    DVid private _dvid; // DVid ERC721 Token
    address payable private immutable _owner; // owner of DeTok

    constructor(DTok dtok_, DVid dvid_) {
        _dtok = dtok_;
        _dvid = dvid_;
        _owner = payable(_msgSender());
    }

    // Registered De-Tok user can claim 100 DTOK Tokens
    function claimToken() public payable checkClaimed(msg.sender) {
        _claimedAddress[msg.sender] = true;
        _dtok.transfer(msg.sender, CLAIMABLE_TOKEN);
    }

    // Mint Video
    function mintVideo(
        uint8 videoType,
        string memory uri,
        string memory cid
    ) public returns (uint256 videoId) {
        videoId = _videoIdCounter.current();
        _dvid.safeMint(msg.sender, videoId, uri);

        // Create Video record
        VideoRecord memory videoRecord = VideoRecord(msg.sender, cid, 0, true, false, 1000000);

        // Storing mapping

        if (videoType == 0) {
            _basicVideos[videoId] = videoRecord;
            _videoType[videoId] = VideoType.BASIC;
        } else {
            _trendingVideos[videoId] = videoRecord;
            _videoType[videoId] = VideoType.TRENDING;
        }

        uint256 currentIndex = _videoCounter[msg.sender]; // moving index
        _videoOwners[msg.sender][currentIndex] = videoId; // adding video id to msg sender
        _videoIdCounter.increment();
        _videoCounter[msg.sender] = _videoIdCounter.current(); // increment moving index
    }

    // Track view counter and change basic to trending - current threshold is set at 10
    function viewVideo(uint256 videoId) public payable checkExist(videoId) {
        if (_videoType[videoId] == VideoType.BASIC) {
            _basicVideos[videoId].views += 1;
            if (_basicVideos[videoId].views > TRENDING_VIEWS_THRESHOLD) {
                _videoType[videoId] = VideoType.TRENDING; // changing enum type
                _trendingVideos[videoId] = _basicVideos[videoId]; // moving from basic to trending
                _basicVideos[videoId].exist = false; // soft delete
            }
            return;
        }
        address payable videoOwner = payable(_trendingVideos[videoId].owner);
        _dtok.transferFrom(_msgSender(), videoOwner, DEFAULT_PRICE); // Error will throw if insufficient funds
        _trendingVideos[videoId].views += 1;
    }

    // function setPayableVideo(videoId) onlyVideoOwner() public {

    // }

    // function setPayableThreshold(uint256 videoId, uint256 payableThreshold) public {}

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

    // helpers

    // soft delete of video
    function deleteVideo(uint256 videoId)
        public
        checkExist(videoId)
        isVideoOwner(msg.sender, videoId)
    {
        if (_videoType[videoId] == VideoType.TRENDING) {
            _trendingVideos[videoId].exist = false;
        } else {
            _basicVideos[videoId].exist = false;
        }
    }

    // getters

    // get all videos from owner
    function getVideosOfOwner(address address_) public {}

    // modifiers

    modifier isVideoOwner(address address_, uint256 videoId) {
        bool check;
        if (_videoType[videoId] == VideoType.BASIC) {
            if (_basicVideos[videoId].owner == address_) {
                check = true;
            }
        } else if (_videoType[videoId] == VideoType.TRENDING) {
            if (_trendingVideos[videoId].owner == address_) {
                check = true;
            }
        } else {
            if (address_ == _owner) {
                check = true;
            }
        }

        require(check, "You are not the video owner.");
        _;
    }

    modifier checkClaimed(address address_) {
        require(_claimedAddress[address_] == false, "You have already claimed DTOK.");
        _;
    }

    modifier checkExist(uint256 videoId) {
        bool check;
        if (_basicVideos[videoId].exist || _trendingVideos[videoId].exist) {
            check = true;
        }
        require(check, "This video does not exist.");
        _;
    }

    modifier checkTrending(uint256 videoId) {
        require(_videoType[videoId] == VideoType.TRENDING, "This video is Basic.");
        _;
    }

    modifier checkBasic(uint256 videoId) {
        require(_videoType[videoId] == VideoType.BASIC, "This video is Trending!");
        _;
    }
}
