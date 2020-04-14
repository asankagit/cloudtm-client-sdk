import AWS from "aws-sdk" 

if (typeof  window === "undefined") {
    const window = {}
}

//add aws sdk
/*
(function injectAwsSdk(){
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; 
    // g.async=true; g.defer=true; 
    g.src='https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js'; 
    g.setAttribute('src','https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js');
    // s.parentNode.insertBefore(g,s);
    document.head.appendChild(g);
    console.log("injection called",AWS)

})()
*/


const BASE_URL = "https://jzjlb1p0tc.execute-api.ap-south-1.amazonaws.com/Prod"
try{
// Configure Credentials to use Cognito
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-south-1:4a4523dc-c83d-4fed-8a94-ce7192edd6fa' 
});


AWS.config.region = 'ap-south-1';
// We're going to partition Amazon Kinesis records based on an identity.
// We need to get credentials first, then attach our event listeners.
AWS.config.credentials.get(function (err) {
    // attach event listener
    if (err) {
        console.log('Error retrieving credentials.');
        console.log(err);
        return;
    }
    // create Amazon Kinesis service object
    var kinesis = new AWS.Kinesis({
        apiVersion: '2013-12-02'
    });

    // Get the ID of the Web page element.
    var blogContent = document.getElementsByTagName("body")[0].children[0];

    // Get Scrollable height
    var scrollableHeight = blogContent.clientHeight;

    var recordData = [];
    var TID = null;
    blogContent.addEventListener('scroll', function (event) {
        clearTimeout(TID);
        // Prevent creating a record while a user is actively scrolling
        TID = setTimeout(function () {
            // calculate percentage
            var scrollableElement = event.target;
            var scrollHeight = scrollableElement.scrollHeight;
            var scrollTop = scrollableElement.scrollTop;

            var scrollTopPercentage = Math.round((scrollTop / scrollHeight) * 100);
            var scrollBottomPercentage = Math.round(((scrollTop + scrollableHeight) / scrollHeight) * 100);

            // Create the Amazon Kinesis record
            var record = {
                Data: JSON.stringify({
                    siteId: this._utm.key || "7e35ba54-cea2-42ad-af83-c748c6ec10e8",
                    blog: window.location.href,
                    scrollTopPercentage: scrollTopPercentage,
                    scrollBottomPercentage: scrollBottomPercentage,
                    time: new Date()
                }),
                PartitionKey: 'partition-' + AWS.config.credentials.identityId
            };
            recordData.push(record);
        }, 100);
    });

    // upload data to Amazon Kinesis every second if data exists
    setInterval(function () {
        if (!recordData.length) {
            return;
        }
        // upload data to Amazon Kinesis
        kinesis.putRecords({
            Records: recordData,
            StreamName: 'MyKinesisStream'
        }, function (err, data) {
            if (err) {
                console.error(err);
            }
        });
        // clear record data
        recordData = [];
    }, 1000);
});
}
catch(e){
    console.log(e)
}
async function fetchBasketItes() {
    let result = ""
    var promise = await fetch(`${BASE_URL}/clickstream?basketId=zxczxc`)
        .then(res => res.body)
        .then(body => {
            const reader = body.getReader()
            return reader.read().then(({ done, value }) => {
                var str = String.fromCharCode.apply(null, value);
                result = str
                return str
            })
        })
        .catch(e => console.log(e))
        .catch(e => console.log(e))
    console.log(result)

};

// Example POST method implementation:
async function postData(basket = {}) {

    /*sample data Object 
{
    type: 'add',
    timeStamp: 2345673,
    basketId: 'zxczxv',
    basket_item: 'Family room',
    item_count: 2
  }
  */
    const data = {
        ...basket, 
        basketId: `${this.key}#${basket.basketId}`,
        timeStamp: new Date().getTime()
    }

    let result = ""
    result = await fetch(`${BASE_URL}/clickstream`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(res => res.body).then(body => {
            const reader = body.getReader();
            return reader.read().then(({ done, value }) => {
                result = String.fromCharCode.apply(null, value)
                return result
            }
            )
        })
        .catch(e => console.log(e))
    console.log(result)
}

function clickEventListener() {
    console.log("UTM click detected")
}

const help = "UTM(Universal Tag Manger) is free and opensource software \n "
    + "writeClickStrem to add click event data \n viewClickStrem to view event data";

function visitorCountEvent() {
    console.log(this.key || this._utm.key)
    fetch(`${BASE_URL}/visitors`, {
        method: "POST",
        body: JSON.stringify({
            siteId: this._utm.key
        })
    })
        .then(res => res.body).then(body => {
            const reader = body.getReader();
            return reader.read().then(({ done, value }) => {
                return String.fromCharCode.apply(null, value)

            }
            )
        })
        .catch(e => console.log(e))
}
var COOKIE_NAME = "loogeduser"
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    var cookie = name + "=" + (value || "")  + expires + "; path=/";
    localStorage.setItem(name, cookie);
}

function getCookie(name) {
    var nameEQ = name + "=";
    // var ca = document.cookie.split(';');
    var ca =  localStorage.getItem(name).split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;'; 
    localStorage.removeItem(name) 
}

const UTM = {
    log: [],
    isLoading: true,
    writeClickStrem: postData,
    viewClickStrem: fetchBasketItes,
    help,
    visitorCount: visitorCountEvent,
    client: window.location.href,
    set utmKey(key) {
        this.key = key
    },
    set current(name) {
        this.log.push(name);
    },

}


window.addEventListener("click", clickEventListener)
window.addEventListener("load", UTM.visitorCount)
window._utm = UTM
module.exports = (str) => {
    return UTM
}