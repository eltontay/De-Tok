// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./DTok.sol";
import "./DVid.sol";

contract DeTok {
    using Counters for Counters.Counter;

    Counters.Counter private _videoIdCounter;

    // 2 Video Types, values are 0 and 1 respectively
    enum VideoType {
        BASIC,
        TRENDING
    }

    // Constants
    uint256 private constant TRENDING_VIEWS_THRESHOLD = 10; // dynamic with default value, setting to 10 for testing purposes
    uint256 private constant CLAIMABLE_TOKEN = 100 * 10**18; // fixed initial claimable amount
    uint256 private constant DEFAULT_STORAGE_WINDOW = 15; // dyanmic with default values
    uint256 private constant DEFAULT_PRICE = 1 * 10**18; // 1 DTOK with 18 decimals
    uint256 public _tokenPrice = 100 wei;

    // Mapping
    mapping(uint256 => VideoType) private _videoType; // video id to video type
    mapping(uint256 => VideoRecord) private _basicVideos; // basic video collection
    mapping(uint256 => VideoRecord) private _trendingVideos; // trendy video collection
    mapping(address => uint256) private _totalOwnerVideoCounter; // counter for number of videos for each video owner for video id
    mapping(address => uint256) private _totalOwnerVideo; // increases and decreases accordingly
    mapping(address => uint256) private _totalOwnerBasicVideo; // increases and decreases accordingly
    mapping(address => uint256) private _totalOwnerTrendingVideo; // increases and decreases accordingly
    mapping(address => mapping(uint256 => uint256)) private _videoOwners; // owner to index to video ids
    mapping(address => bool) private _claimedAddress; // track claimed tokens to address

    uint256 public totalVideo = 0; // Total number of Videos
    uint256 public totalBasic = 0; // Total number of Basic Videos
    uint256 public totalTrending = 0; // Total number of Trending Videos

    // Video Record Structure
    struct VideoRecord {
        address owner;
        string cid;
        uint256 views;
        bool exist; // soft delete
        bool payableVideo;
        uint256 payableThreshold; // recommended value to 1,000,000
    }

    struct Users {
        address user;
        // string web3api;
    }

    DTok private _dtok; // DTok ERC20 Token
    DVid private _dvid; // DVid ERC721 Token
    address payable private immutable _owner; // owner of DeTok

    constructor(DTok dtok_, DVid dvid_) {
        _dtok = dtok_;
        _dvid = dvid_;
        _owner = payable(msg.sender);
    }

    // Registered De-Tok user can claim 100 DTOK Tokens
    function claimToken() public payable checkClaimed(msg.sender) {
        _claimedAddress[msg.sender] = true;
        _dtok.mint(msg.sender, CLAIMABLE_TOKEN);
    }

    // Mint Video
    function mintVideo(
        string memory uri,
        string memory cid,
        bool payableVideo_
    ) public returns (uint256 videoId) {
        videoId = _videoIdCounter.current();
        _dvid.safeMint(msg.sender, uri);

        // Create Video record
        VideoRecord memory videoRecord = VideoRecord(
            msg.sender,
            cid,
            0,
            true,
            payableVideo_,
            1000000
        );

        // Storing mapping
        _basicVideos[videoId] = videoRecord;
        _videoType[videoId] = VideoType.BASIC;

        uint256 currentIndex = _totalOwnerVideoCounter[msg.sender]; // moving index
        _videoOwners[msg.sender][currentIndex] = videoId; // adding video id to msg sender
        _videoIdCounter.increment();
        _totalOwnerVideoCounter[msg.sender] += 1; // increment moving index
        _totalOwnerVideo[msg.sender] += 1;
        _totalOwnerBasicVideo[msg.sender] += 1;
        totalBasic += 1;
        totalVideo += 1;
    }

    // Track view counter and change basic to trending - current threshold is set at 10
    function viewVideo(uint256 videoId) public payable {
        require(checkExist(videoId), "Video does not Exist");
        if (_videoType[videoId] == VideoType.BASIC) {
            _basicVideos[videoId].views += 1;
            if (_basicVideos[videoId].views > TRENDING_VIEWS_THRESHOLD) {
                address basicVideoOwner = _basicVideos[videoId].owner;
                _videoType[videoId] = VideoType.TRENDING; // changing enum type
                _trendingVideos[videoId] = _basicVideos[videoId]; // moving from basic to trending
                _basicVideos[videoId].exist = false; // soft delete
                _totalOwnerBasicVideo[basicVideoOwner] -= 1;
                _totalOwnerTrendingVideo[basicVideoOwner] += 1;
                totalBasic -= 1;
                totalTrending += 1;
            }
            return;
        }
        address payable videoOwner = payable(_trendingVideos[videoId].owner);
        _dtok.transferFrom(msg.sender, videoOwner, DEFAULT_PRICE); // Error will throw if insufficient funds
        _trendingVideos[videoId].views += 1;

    }

    // helpers

    function setPayableThreshold(uint256 videoId, uint256 amount) public {
        require(checkExist(videoId), "Video does not Exist");
        if (_videoType[videoId] == VideoType.BASIC) {
            _basicVideos[videoId].payableThreshold = amount;
        } else {
            _trendingVideos[videoId].payableThreshold = amount;
        }
    }

    function setPayableVideo(uint256 videoId) public {
        require(checkExist(videoId), "Video does not Exist");
        if (_videoType[videoId] == VideoType.BASIC) {
            _basicVideos[videoId].payableVideo = true;
        } else {
            _trendingVideos[videoId].payableVideo = true;
        }
    }

    function unSetPayableVideo(uint256 videoId) public {
        require(checkExist(videoId), "Video does not Exist");
        if (_videoType[videoId] == VideoType.BASIC) {
            _basicVideos[videoId].payableVideo = false;
        } else {
            _trendingVideos[videoId].payableVideo = false;
        }
    }

    // soft delete of video
    function deleteVideo(uint256 videoId) public isVideoOwner(msg.sender, videoId) {
        require(checkExist(videoId), "Video does not Exist");
        if (_videoType[videoId] == VideoType.TRENDING) {
            _trendingVideos[videoId].exist = false;
            totalTrending -= 1;
            _totalOwnerTrendingVideo[msg.sender] -= 1;
        } else {
            _basicVideos[videoId].exist = false;
            totalBasic -= 1;
            _totalOwnerBasicVideo[msg.sender] -= 1;
        }
        totalVideo -= 1;
        _totalOwnerVideo[msg.sender] -= 1;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "error");
    }

    function buy(uint256 _numberOfTokens) public payable {
        require(msg.value >= _numberOfTokens * _tokenPrice, "Insufficient Value");
        _owner.transfer(msg.value);
        _dtok.mint(msg.sender, _numberOfTokens);
    }

    // getters

    // get all video cids from msg sender
    function getAllVideoCIDOfOwner() public view returns (string[] memory) {
        uint256 total = _totalOwnerVideo[msg.sender];
        string[] memory ret = new string[](total);
        uint256 counter = 0;
        for (uint256 i = 0; i <= _totalOwnerVideoCounter[msg.sender]; i++) {
            uint256 videoId = _videoOwners[msg.sender][i];
            if (_videoType[videoId] == VideoType.BASIC) {
                if (_basicVideos[videoId].exist) {
                    ret[counter] = _basicVideos[videoId].cid;
                    counter += 1;
                }
            } else {
                if (_trendingVideos[videoId].exist) {
                    ret[counter] = _trendingVideos[videoId].cid;
                    counter += 1;
                }
            }
        }
        return ret;
    }

    // get all basic video cids from msg sender
    function getAllBasicVideoCIDOfOwner() public view returns (string[] memory) {
        uint256 total = _totalOwnerBasicVideo[msg.sender];
        string[] memory ret = new string[](total);
        uint256 counter = 0;
        for (uint256 i = 0; i <= _totalOwnerVideoCounter[msg.sender]; i++) {
            uint256 videoId = _videoOwners[msg.sender][i];
            if (_videoType[videoId] == VideoType.BASIC) {
                if (_basicVideos[videoId].exist) {
                    ret[counter] = _basicVideos[videoId].cid;
                    counter += 1;
                }
            }
        }
        return ret;
    }

    // get all trending video cids from msg sender
    function getAllTrendingVideoCIDOfOwner() public view returns (string[] memory) {
        uint256 total = _totalOwnerTrendingVideo[msg.sender];
        string[] memory ret = new string[](total);
        uint256 counter = 0;
        for (uint256 i = 0; i <= _totalOwnerVideoCounter[msg.sender]; i++) {
            uint256 videoId = _videoOwners[msg.sender][i];
            if (_videoType[videoId] == VideoType.TRENDING) {
                if (_trendingVideos[videoId].exist) {
                    ret[counter] = _trendingVideos[videoId].cid;
                    counter += 1;
                }
            }
        }
        return ret;
    }


    // get all video cids
    function getAllCid() public view returns (string[] memory) {
        string[] memory ret = new string[](totalVideo);
        uint256 counter = 0;
        for (uint256 i = 0; i <= _videoIdCounter.current(); i++) {
            if (checkExist(i)) {
                if (_videoType[i] == VideoType.BASIC) {
                    ret[counter] = _basicVideos[i].cid;
                } else {
                    ret[counter] = _trendingVideos[i].cid;
                }
                counter += 1;
            }
        }
        return ret;
    }

    // get all basic video cids
    function getAllBasicCid() public view returns (string[] memory) {
        string[] memory ret = new string[](totalBasic);
        uint256 counter = 0;
        for (uint256 i = 0; i <= _videoIdCounter.current(); i++) {
            if (checkExist(i)) {
                if (_videoType[i] == VideoType.BASIC) {
                    ret[counter] = _basicVideos[i].cid;
                    counter += 1;
                } 
            }
        }
        return ret;
    }

    // get all trending video cids
    function getAllTrendingCid() public view returns (string[] memory) {
        string[] memory ret = new string[](totalTrending);
        uint256 counter = 0;
        for (uint256 i = 0; i <= _videoIdCounter.current(); i++) {
            if (checkExist(i)) {
                if (_videoType[i] == VideoType.TRENDING) {
                    ret[counter] = _trendingVideos[i].cid;
                    counter += 1;
                } 
            }
        }
        return ret;
    }



    function getViews(uint256 videoId) public view returns (uint256) {
        require(
            _basicVideos[videoId].exist || _trendingVideos[videoId].exist,
            "Video does not Exist"
        );
        if (_videoType[videoId] == VideoType.BASIC) {
            return _basicVideos[videoId].views;
        } else {
            return _trendingVideos[videoId].views;
        }
    }

    function getPayableVideo(uint256 videoId) public view returns (bool) {
        require(
            _basicVideos[videoId].exist || _trendingVideos[videoId].exist,
            "Video does not Exist"
        );
        if (_videoType[videoId] == VideoType.BASIC) {
            return _basicVideos[videoId].payableVideo;
        } else {
            return _trendingVideos[videoId].payableVideo;
        }
    }

    function checkExist(uint256 videoId) public view returns (bool) {
        if (_basicVideos[videoId].exist || _trendingVideos[videoId].exist) {
            return true;
        }
        return false;
    }

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

    modifier checkTrending(uint256 videoId) {
        require(_videoType[videoId] == VideoType.TRENDING, "This video is Basic.");
        _;
    }

    modifier checkBasic(uint256 videoId) {
        require(_videoType[videoId] == VideoType.BASIC, "This video is Trending!");
        _;
    }
}
