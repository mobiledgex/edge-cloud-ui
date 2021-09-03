import { perpetual } from "../../../../helper/constant"

export const osList = [perpetual.OS_LINUX, perpetual.OS_WINDOWS, perpetual.OS_OTHERS]

export const buildTip = `List of GPU driver build
Build Name:</b> Unique identifier key
Driver Path:</b> Path where the driver package is located, if it is authenticated path, then credentials must be passed as part of URL (one-time download path)
MD5 Sum:</b> Driver package md5sum to ensure package is not corrupted
Driver Path Creds:</b> Optional credentials (username:password) to access driver path
Operating System:</b> Operator System supported by GPU driver build, one of Linux, Windows, Others
Kernel Version:</b> Kernel Version supported by GPU driver build
Hypervisor Info:</b> Info on hypervisor supported by vGPU driver
`