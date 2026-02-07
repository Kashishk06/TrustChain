// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustChain {

    struct FileData {
        bytes32 fileHash;
        string ipfsHash;
        address owner;
        bool exists;
    }

    struct Access {
        uint256 expiry;
        bool allowed;
    }

    mapping(uint256 => FileData) public files;
    mapping(uint256 => mapping(address => Access)) public accessList;
    mapping(address => int256) public trustScore;

    bool public emergencyMode;
    uint256 public fileCount;

    event FileUploaded(uint256 indexed fileId, address indexed owner);
    event AccessGranted(uint256 indexed fileId, address indexed user, uint256 expiry);
    event EmergencyActivated(address indexed admin);

    modifier onlyOwner(uint256 _fileId) {
        require(files[_fileId].owner == msg.sender, "Not file owner");
        _;
    }

    modifier noEmergency() {
        require(!emergencyMode, "Emergency active");
        _;
    }

    // 1️⃣ Upload file (hash + IPFS)
    function uploadFile(bytes32 _fileHash, string calldata _ipfsHash) external {
        fileCount++;
        files[fileCount] = FileData(
            _fileHash,
            _ipfsHash,
            msg.sender,
            true
        );
        trustScore[msg.sender] += 10;
        emit FileUploaded(fileCount, msg.sender);
    }

    // 2️⃣ Grant time-bound access
    function grantAccess(
        uint256 _fileId,
        address _user,
        uint256 _expiry
    ) external onlyOwner(_fileId) {
        require(_expiry > block.timestamp, "Expiry must be future time");

        accessList[_fileId][_user] = Access(_expiry, true);
        trustScore[msg.sender] += 5;

        emit AccessGranted(_fileId, _user, _expiry);
    }

    // 3️⃣ Check access validity
    function canAccess(uint256 _fileId, address _user)
        public
        view
        returns (bool)
    {
        Access memory a = accessList[_fileId][_user];
        return a.allowed && block.timestamp <= a.expiry && !emergencyMode;
    }

    // 4️⃣ Emergency Kill Switch
    function activateEmergency() external {
        emergencyMode = true;
        trustScore[msg.sender] -= 20;
        emit EmergencyActivated(msg.sender);
    }
}
