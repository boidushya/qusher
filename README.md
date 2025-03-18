# [Qusher](https://qusher.boidu.dev/)

<div align="center">
  <img src="public/qusher.svg" alt="Qusher" width="200"/>
</div>

A proof of concept application that enables file transfers using QR codes, without requiring server storage or direct network connections between devices.

## 🧪 Proof of Concept

This project is primarily a fun proof of concept rather than a practical file transfer solution. Due to the inherent limitations of QR codes, it's best suited for extremely small files (a few KB at most). For real-world file transfers, traditional methods like Bluetooth, cloud services, or messaging apps would be more efficient.

## 📱 Overview

QR File Transfer breaks files down into smaller chunks, encodes those chunks as a series of QR codes, and displays them sequentially. The receiving device scans these QR codes using its camera and reassembles the file. This works even when devices can't connect to the same network or when you prefer to avoid uploading files to third-party services.

## ✨ Key Features

- **Serverless Operation**: Transfer files without uploading to any servers
- **Network-Independent**: No need for devices to be on the same network
- **Visual Progress Tracking**: Real-time indicators for both sending and receiving
- **Educational**: Demonstrates concepts of chunking, encoding, and reassembly

## 🛠️ Technical Overview

The application consists of two main components:
1. **Sender**: Chunks the file, converts chunks to QR codes, and displays them sequentially
2. **Receiver**: Scans QR codes, tracks received chunks, and reassembles the file

## 🚀 Getting Started

Try the live demo at [qusher.boidu.dev](https://qusher.boidu.dev/)

```bash
# Clone and install dependencies
git clone https://github.com/boidushya/qusher.git
cd qusher
bun install

# Start development server
bun dev
```

## 📋 Limitations

- **File Size**: Optimal for very small files (a few KB)
- **Transfer Speed**: Much slower than conventional methods
- **Practical Use**: More of an educational tool than a practical file transfer solution

## 🔧 Troubleshooting

- Ensure good lighting for scanning
- Hold the camera steady
- Make sure the QR code is fully visible

## 📄 License

This project is licensed under the GPL-3.0 License.
