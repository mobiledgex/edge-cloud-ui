let aa = { "region": "EU", "app": { "key": { "developer_key": { "name": "MobiledgeX" }, "name": "BICINKIAPP", "version": "1.1" }, "scale_with_cluster": false, "deployment": "docker", "image_type": "ImageTypeDocker", "image_path": "docker.mobiledgex.net/mobiledgex/images/facedetection", "access_ports": "", "default_flavor": { "name": "m4.medium" }, "cluster": { "name": "" }, "auth_public_key": "", "official_fqdn": "", "android_package_name": "", "command": "", "deployment_manifest": "" } }


// swagger 최신
let bb =

{
    "default_shared_volume_size": "string",
    "access_ports": "string",
    "default_flavor": {
        "name": "string"
    },
    "official_fqdn": "string",
    "scale_with_cluster": true,
    "image_path": "string",
    "deployment_manifest": "string",
    "image_type": "IMAGE_TYPE_UNKNOWN",
    "access_type": "ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT",
    "auto_prov_policy": "string",
    "default_privacy_policy": "string",
    "command": "string",
    "deployment": "string",
    "key": {
        "developer_key": {
            "name": "string"
        },
        "name": "string",
        "version": "string"
    }
}

// UpdateApp : 개발된 소스 코드에서 이렇게 보냄
let cc = 
{
    "method":"UpdateApp",
    "token":"",
    "data":
    {
        "region":"EU",
        "app":
        {
            "key":{"developer_key":{},"name":"","version":"1.1"},
            "scale_with_cluster":false,
            "deployment":"",
            "image_type":"ImageTypeDocker",
            "image_path":"docker.mobiledgex.net/mobiledgex/images/facedetection",
            "access_ports":"",
            "default_flavor":{"name":""},
            "cluster":{"name":""},
            "auth_public_key":"",
            "official_fqdn":"",
            "android_package_name":"",
            "command":"",
            "deployment_manifest":"",
            "fields":["9.1"]
        }
    }
}

// 차이 점
"cluster":{"name":""},
"auth_public_key":"",
"android_package_name":"",