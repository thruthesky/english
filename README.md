# English
#Errors
-in lms class id required
    [{"code":-106,"message":"Please, input Class ID."}]
-in lms domain should not be empty
    [But in to do list for witheng and onfis the domain is empty]
-in lms Nickname is concatinated with domain 
    [1062 : Duplicate entry 'Test Boy@witheng.onlineenglish.kr' for key 'mb_nick']
-error Register/login password must not be numeric

# TODO

* in reservation handle also if there is many reservations on a single day


* make error on class reservation by month and show error message nicely.
* do all error handling.



# Domain and ID matching



if domain in address bar is


igoodtalk.com       then, the domain should be "igoodtalk.onlineenglish.kr"
iamtalkative.com    then, domain is '' "talkative.onlineenglish.kr"

witheng.com         then, domain is ''
onfis.com           then, domain is ''


If domain is not one of above, then, translate

"ID@" plus "first part of the domain" plus ".onlineenglish.kr"

if the first part is 'www', then apply the second part.

for instance, if domain is "www.abc.co.kr", then the translated would be "ID@abc.onlineenglish.kr"


Sample ID: mgonkim of "www.iamtalkative.com"
Sample ID: italk2 of "www.iamtalkative.com"

test id: testboy pw:0000
testboy@talkative.onlineenglish.kr




# Installation


git submodule update --imit
npm install 
npm install @ng-bootstrap/ng-bootstrap



