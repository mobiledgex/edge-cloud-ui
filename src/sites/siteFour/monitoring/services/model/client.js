/*
$ http --verify=false --auth-type=jwt --auth=$SUPERPASS POST https://127.0.0.1:9900/api/v1/auth/metrics/client <<<
'{"region":"local","appinst":{"app_key":{"organization":"AcmeAppCo","name":"someapplication1","version":"1.0"}},"method":"FindCloudlet","selector":"api","last":1}'
HTTP/1.1 200 OK
//////////
{
  "region": "local",
  "appinst": {
    "app_key": {
      "organization": "AcmeAppCo",
      "name": "someapplication1",
      "version": "1.0"
    }
  },
  "method": "FindCloudlet",
  "selector": "api",
  "last": 1
}
*/