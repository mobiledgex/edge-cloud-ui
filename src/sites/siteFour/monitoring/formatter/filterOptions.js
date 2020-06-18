export const DISK_USED = "diskUsed";
export const VCPU = "vCpuUsed";
export const MEM = "memUsed";
export const IPV4 = "ipv4Used";

/**
<< Cloudlet>>
— utilization
diskMax - Max available Disk size in GBs
diskUsed - Disk used at a timestamp in GBs
memMax - Max memory on this cloudlet in MBs
memUsed - Memory used at timestamp in MBs
vCpuMax - Max available number of vCPUs on this cloudlet
vCpuUsed - Number vCPUs on this cloudlet at timestamp
—  ipusage
floatingIpsMax - Max available number of floating IP addresses
floatingIpsUsad -  Number floating IP addresses on this cloudlet at timestamp
ipv4Max - Max available number of external IPv4 addresses
ipv4Used - Number external IPv4 addresses on this cloudlet at timestamp
*/