// Configure Credentials to use Cognito
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:d3cec5af-7888-4dd0-8ba0-bb05bf2181b8'
});

AWS.config.region = 'us-east-2';
// We're going to partition Amazon Kinesis records based on an identity.
// We need to get credentials first, then attach our event listeners.
AWS.config.credentials.get(function(err) {
    // attach event listener
    if (err) {
        alert('Error retrieving credentials.');
        console.error(err);
        return;
    }
    // create Amazon Kinesis service object
    var kinesis = new AWS.Kinesis({
        apiVersion: '2013-12-02'
    });

    // Get the ID of the Web page element.
    var blogContent = document.getElementById('BlogContent');

    // Get Scrollable height
    var scrollableHeight = blogContent.clientHeight;

    var recordData = [];
    var TID = null;
    blogContent.addEventListener('scroll', function(event) {
        clearTimeout(TID);
        // Prevent creating a record while a user is actively scrolling
        TID = setTimeout(function() {
            // calculate percentage
            var scrollableElement = event.target;
            var scrollHeight = scrollableElement.scrollHeight;
            var scrollTop = scrollableElement.scrollTop;

            var scrollTopPercentage = Math.round((scrollTop / scrollHeight) * 100);
            var scrollBottomPercentage = Math.round(((scrollTop + scrollableHeight) / scrollHeight) * 100);

            // Create the Amazon Kinesis record
            var record = {
                Data: JSON.stringify({
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
    setInterval(function() {
        if (!recordData.length) {
            return;
        }
        // upload data to Amazon Kinesis
        kinesis.putRecords({
            Records: recordData,
            StreamName: 'MyKinesisStream'
        }, function(err, data) {
            if (err) {
                console.error(err);
            }
        });
        // clear record data
        recordData = [];
    }, 1000);
});

async function fetchBasketItes(){
    let result = ""
    var promise = await fetch("https://jzjlb1p0tc.execute-api.ap-south-1.amazonaws.com/Prod/clickstream?basketId=zxczxc")
    .then(res => res.body)
        .then(body =>{
            const reader = body.getReader()
            return reader.read().then(  ({done, value}) => {
                var str = String.fromCharCode.apply(null, value);
                result = str
                return str
            })   
        })
        .catch(e => console.log(e))
    .catch(e => console.log(e))
    console.log( result)
  
};

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // // Default options are marked with *
    // const response = await fetch(url, {
    //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // //   mode: 'cors', // no-cors, *cors, same-origin
    // //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // //   credentials: 'same-origin', // include, *same-origin, omit
    //   headers: {
    //     'Content-Type': 'application/json'
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    // //   redirect: 'follow', // manual, *follow, error
    // //   referrerPolicy: 'no-referrer', // no-referrer, *client
    //   body: JSON.stringify(data) // body data type must match "Content-Type" header
    // });
    // return await response // .json(); // parses JSON response into native JavaScript objects
    let result = ""
    var promise = await fetch("https://jzjlb1p0tc.execute-api.ap-south-1.amazonaws.com/Prod/clickstream", {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(res => res.body)
        .then(body =>{
            const reader = body.getReader()
            return reader.read().then(  ({done, value}) => {
                var str = String.fromCharCode.apply(null, value);
                result = str
                return str
            })   
        })
        .catch(e => console.log(e))
    .catch(e => console.log(e))
    console.log( result)
  
  }

  
