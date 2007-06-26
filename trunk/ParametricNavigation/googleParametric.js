
// This javascript file is used to setup the meta data cluster view

// The host that the search resides on
var mTGSAHost = "SOMEHOST.com";
var originalURL;

// The name of the id where the meta data clusters are going to be placed
var idName = "";

// Whether or not we are going to show the number of hits beside each item
// By default, displaying the hit count is turned off.
var mTShowNumbers = 0;

// Hashes used for various things such as whether to display or combine fields
// and sorting information.
var mTDisplayHash;
var mTCombineHash;
var mTSortHash;
var mTDisplayNameHash;

var mTArray;

// The header to display above the parametric navigation
var mTHeader = "Parametric Navigation";

// How mata data values do we display for each meta data item before we show the more link and hide the rest
var mTMaxDisplay = 5;

var mTExpandName = "expand...";
var mTCollapseName = "collapse...";

// The label for the all display for each meta data bucket
var mTAllName = "all";
var mTAllLocation = "list"; // Value of list indicates in the list and a value of
                         // header indicates in the header

// Create a request object
var mTHTTP = mTCreateRequestObject();

// Create the Request Object that we will use to make AJAX calls.
function mTCreateRequestObject()
{

  var ro;
  var browser = navigator.appName;

  if(browser == "Microsoft Internet Explorer")
  {
    ro = new ActiveXObject("Microsoft.XMLHTTP");
  } else
  {
    ro = new XMLHttpRequest();
  }

  return ro;
}

// This function allows the user to select the meta data tags that they want to
// display.
function mTAddField(metaTagName, metaTagDelimiter)
{
  if (!mTDisplayHash)
  {
    mTDisplayHash = new Array();
  }
  mTDisplayHash[metaTagName] = metaTagDelimiter;
}

// This function allows the user to change the display name of the meta tags
// that they are displaying.
function mTSetDisplayName(metaTagName, metaTagDisplayName)
{
  if (!mTDisplayNameHash)
  {
    mTDisplayNameHash = new Array();
  }
  mTDisplayNameHash[metaTagName] = metaTagDisplayName;
}

// This function allows the user to set the header displayed above the
// parametric navigation
function mTSetHeader(headerName)
{
  mTHeader = headerName;
}

// This function allows the user to set the placement and text of the all link
function mTSetAllPlacement(allName, allLocation)
{
  mTAllName = allName;
  mTAllLocation = allLocation.toLowerCase();
}

// This function allows the user to tell parametric to show or hide the numbers
function mTSetShowNumbers(show)
{
  mTShowNumbers = show;
}

// This function allows the user to set name of the value to display for the
// expand... link.
function mTSetExpandName(expandName)
{
  mTExpandName = expandName;
}

// This function allows the user to set name of the value to display for the
// collapse... link.
function mTSetCollapseName(collapseName)
{
  mTCollapseName = collapseName;
}

// This function allows the user to set the maximum number of items to be
// displayed for each meta tag.
function mTSetMaxDisplay(maxDisplay)
{
  mTMaxDisplay = maxDisplay;
}


// This function allows the user to set the host to send the parametric query
// to.
function mTSetHost(hostName)
{
  mTGSAHost = hostName;
}

// This function allows the user to set how the parametric results for a
// specific metaTag are sorted.
// A sortBy value of 'alpha asc' indicates alphabetical sorting in ascending order.
// A sortBy value of 'alpha desc' indicates alphabetical sorting in descending order.
// A sortBy value of 'hits asc' indicates sorting on hits in ascending order.
// A sortBy value of 'hits asc' indicates sorting on hits in descending order.
function mTSort(metaTagName, sortBy)
{
  if (!mTSortHash)
  {
    mTSortHash = new Array();
  }
  mTSortHash[metaTagName] = sortBy;
}

// This function allows the user to select the meta data tags that they want to
// display.
function mTCombineField(mTNameS, mTNameE)
{
  if (!mTCombineHash)
  {
    mTCombineHash = new Array();
  }
  mTCombineHash[mTNameS] = mTNameE;
}

// This function is called when the page is loaded.  This kicks off the calls
// to get all the meta tag values.
function mTLoad(id, mTURL)
{
  idName = id;
  originalURL = "http://" + mTGSAHost + "/search?" + mTURL.replace(/&partialfields=.*?&/, "&");

  // Modify the URL to get the appropriate XML output
  var url = "http://" + mTGSAHost + "/search?" + mTURL + "&num=100";
  url = url.replace(/&proxystylesheet=.*?&/, "&");
  // alert("in mtLoad about to post " + url);
  // This must be a get or it will not work with firefox.  For IE it can be
  // either and it will work.
  mTHTTP.open('get', url);
  mTHTTP.setRequestHeader("Content-Length", url.length);
  mTHTTP.onreadystatechange = mTHandleResponse;
  mTHTTP.send(null);
}

function mTHandleResponse()
{
  if(mTHTTP.readyState == 4)
  {
    if (mTHTTP.status == 200)
    {      // perfect!

      var response = mTHTTP.responseXML;

      // Parse the results and build the appropriate list of meta tags
      // and thier count.
      mTParse(idName, response);

    } else
    {
      // there was a problem with the request,
      // for example the response may be a 404 (Not Found)
      // or 500 (Internal Server Error) response codes
      alert("HTTP ERROR STATUS: " + mTHTTP.status);
      var responseText = mTHTTP.responseText;
      alert(responseText);
    }
  }
}

function trim(str)
{
  return str.replace(/\s+/g, " ").replace(/^\s*|\s*$/g,"");
}

function mTParse(idName, response)
{

  var metaTagName;
  var metaTagValue;
  var metaTagDelimiter;
  // var mTArray = new Array();
  var displayTagName = false;
  var mTResult = "";

  // Go through each meta tag in the XML response.
  var metaTags = response.getElementsByTagName('MT');

  // Only display parametric information if there is parametric information to
  // display
  if (metaTags.length > 0)
  {
    for(var i=0;i<metaTags.length;i++)
    {
      metaTagName = "";
      metaTagValue = "";
      metaTagDelimiter = "";

      // Get the meta tag name and modify it if necessary.
      metaTagName = metaTags[i].attributes.getNamedItem("N").value;
      metaTagName = metaTagName.toLowerCase();
      metaTagName = mTDoCombination(metaTagName);
      // alert("metaTagName = " + metaTagName);

      // Get the meta tag value and modify it if necessary.
      metaTagValue = metaTags[i].attributes.getNamedItem("V").value;
      metaTagValue = trim(metaTagValue);
      // alert("metaTagValue = " + metaTagValue);

      displayTagName = false;
      if (metaTagValue != "")
      {
        // Find out if the meta tag name matches one that we are suppossed to
        // allow
        if (mTDisplayHash)
        {
          // Here we check the current tag name against the list of valid tag names
          displayTagName  = false;
          for (var mT in mTDisplayHash)
          {
            if (mT.toLowerCase() == metaTagName.toLowerCase())
            {
              displayTagName = true;
              metaTagDelimiter = mTDisplayHash[mT];
            }
          }
        } else
        {
          displayTagName = true;
        }

        // If this occurs, then figure out the delimiter
        if (displayTagName == true)
        {

          if (!mTArray)
          {
            mTArray = new Array();
          }

          // Do we have a delimiter?  If so, we have to see if we have to split this
          // value and do this mulitple times.
          if (metaTagDelimiter != "")
          {
            var newMTValues;
            newMTValues = metaTagValue.split(metaTagDelimiter);
            for(var j=0;j<newMTValues.length;j++)
            {
              if (newMTValues[j] != "")
              {
                // Call a function here which will generate the hash with the
                // correct value.
                mTArray  = mTDoHash(mTArray, metaTagName, newMTValues[j]);
              }
            }
          } else
          {
            // Call a function here which will generate the hash with the
            // correct value.
            mTArray  = mTDoHash(mTArray, metaTagName, metaTagValue);
          }
        }
      }
    }
  }

  mTOutputParametric(idName);

  // Put the results to the page
  // document.getElementById(idName).innerHTML = mTResult;
}

function mTDoHash(mTArray, mTName, mTValue)
{
  var lcMTName = mTName.toLowerCase();
  var lcMTValue = trim(mTValue.toLowerCase());
  if (mTArray[lcMTName])
  {
    // We have an array for this meta tag.  Now let's see if we have a
    // dimension for it's value
    if (isNaN(mTArray[lcMTName][lcMTValue]))
    {
      mTArray[lcMTName][lcMTValue] = 1;
    } else
    {
      var tmpVal = mTArray[lcMTName][lcMTValue];
      tmpVal++;
      mTArray[lcMTName][lcMTValue] = tmpVal;
    }
  } else
  {
    mTArray[lcMTName] = new Array();
    mTArray[lcMTName][lcMTValue] = 1;
  }
  return mTArray;
}

function mTDoCombination(mTName)
{
  var lcMTName = mTName.toLowerCase();
  if (mTCombineHash)
  {
    if (mTCombineHash[lcMTName])
    {
      return mTCombineHash[lcMTName];
    }
  }
  return mTName;
}

function mTPosSwitch(mTParametricArr, arrPos1, arrPos2)
{
  var tmpArr = new Array();
  tmpArr[0] = mTParametricArr[arrPos1][0];
  tmpArr[1] = mTParametricArr[arrPos1][1];
  mTParametricArr[arrPos1][0] = mTParametricArr[arrPos2][0];
  mTParametricArr[arrPos1][1] = mTParametricArr[arrPos2][1];
  mTParametricArr[arrPos2][0] = tmpArr[0];
  mTParametricArr[arrPos2][1] = tmpArr[1];
  return mTParametricArr;
}

function hidediv(pass)
{
  var divs = document.getElementsByTagName('div');
  for(i=0;i<divs.length;i++)
  {
    //if they are 'see' divs
    if(divs[i].id.match(pass))
    {
      if (document.getElementById) // DOM3 = IE5, NS6
      {
        divs[i].style.display="none";// show/hide
      } else
      {
        if (document.layers) // Netscape 4
        {
          document.layers[divs[i]].display = 'none';
        } else // IE 4
        {
          document.all.hideShow.divs[i].display = 'none';
        }
      }
    }
  }
}

function showdiv(pass)
{
  var divs = document.getElementsByTagName('div');
  for(i=0;i<divs.length;i++)
  {
    if(divs[i].id.match(pass))
    {
      if (document.getElementById)
      {
        divs[i].style.display="block";
      } else if (document.layers) // Netscape 4
      {
        document.layers[divs[i]].display = 'visible';
      } else // IE 4
      {
        document.all.hideShow.divs[i].display = 'block';
      }
    }
  }
}


function mTOutputParametric(idName)
{
  var mTResult = "";

  if (mTArray)
  {
    mTResult = "<html><body><br/><h3>" + mTHeader + "</h3><font size=\"-1\">";
    for (var i in mTArray)
    {

      var baseURL = originalURL + "&partialfields=" + i + ":";

      if ((mTDisplayNameHash != null) && (mTDisplayNameHash[i]))
      {
        mTResult += "<b>" + mTDisplayNameHash[i] + "</b>";
      } else
      {
        mTResult += "<b>" + i + "</b>";
      }
      if (mTAllLocation == "header")
      {
        mTResult += "(<a href=\"" + originalURL + "\" onClick=\"setCookie('" + i + "', '');\">" + mTAllName + "</a>)<br/>";
      } else if (mTAllLocation == "list")
      {
        mTResult += "<br/><a href=\"" + originalURL + "\" onClick=\"setCookie('" + i + "', '');\">" + mTAllName + "</a><br/>";
      }

      // Stuff the values for this meta tag in an array
      var mTParametricArr = new Array();
      var mTParametricCnt = 0;
      for (var j in mTArray[i])
      {
        mTParametricArr[mTParametricCnt] = new Array();
        mTParametricArr[mTParametricCnt][0] = j;
        mTParametricArr[mTParametricCnt][1] = mTArray[i][j];
        mTParametricCnt++;
      }

      // Now we need to sort if this field is one of the ones we need to sort
      var sortBy = 0;
      var sortOrder = "";
      if (mTSortHash)
      {
        if (mTSortHash[i])
        {
          var tmpArr = mTSortHash[i].split(/ /);
          if (tmpArr[0].toLowerCase() == "hits")
          {
            sortBy = 1;
          }
          if (tmpArr[1].toLowerCase() == "asc")
          {
            sortOrder = "a";
          } else if (tmpArr[1].toLowerCase() == "desc")
          {
            sortOrder = "d";
          }
        }
      }

      // We are just using a simple bubble sort here, because the number of
      // values in the array doesn't warrant anything more powerful such as a
      // quick sort.
      if (sortOrder != "")
      {
        for (var j=0; j<mTParametricArr.length; j++)
        {
          for (var k=0; k<mTParametricArr.length; k++)
          {
            if (sortOrder == "a")
            {
              if (mTParametricArr[j][sortBy] < mTParametricArr[k][sortBy])
              {
                mtParametricArr = mTPosSwitch(mTParametricArr, j, k);
              }
            } else if (sortOrder == "d")
            {
              if (mTParametricArr[j][sortBy] > mTParametricArr[k][sortBy])
              {
                mtParametricArr = mTPosSwitch(mTParametricArr, j, k);
              }
            }
          }
        }
      }


      // Let's figure out if this has been selected.
      var selectedValue = unescape(getCookie(i));
      // alert("selectedValue = " + selectedValue);

      // Now print out the information.
      for (var j=0; j<mTParametricArr.length; j++)
      {
        var linkURL = baseURL;

        // At this point, we have to determine if there is an ampersand in the
        // value.  If there is, we have to split based upon it, and search
        // multiple partial fields.  If not, then we just append the value.
        var seperator = ".";
        if (mTParametricArr[j][0].indexOf("&") > 0)
        {
          var tmpPartialFields = mTParametricArr[j][0].split("&");
          for(var k=0; k < tmpPartialFields.length; k++)
          {
            if (k == 0)
            {
              linkURL += trim(tmpPartialFields[k]);
            } else
            {
              linkURL += seperator + i + ":" + trim(tmpPartialFields[k]);
            }
          }
        } else
        {
          linkURL += mTParametricArr[j][0];
        }
        // var linkURL = baseURL + mTParametricArr[j][0];
        // alert("linkURL = " + linkURL);
        if (j == mTMaxDisplay)
        {
          mTResult += "<div id=\"" + i + "_expand\"><a href=\"javascript:void(0)\" onClick=\"hidediv('" + i + "_expand');showdiv('" + i + "_collapse');\">" + mTExpandName + "</a></div>";
          mTResult += "<div id=\"" + i + "_collapse\" style=\"display:none\">";
        }
        if ((selectedValue != null) && (selectedValue == mTParametricArr[j][0]))
        {
          mTResult += "<b><font color='red'>" + mTParametricArr[j][0] + "</font></b>";
        } else
        {
          mTResult += "<a href=\"" + linkURL + "\" onClick=\"setCookie('" + i + "', '" + mTParametricArr[j][0] + "');\">" + mTParametricArr[j][0] + "</a>";
        }
        if (mTShowNumbers)
        {
          mTResult += " (" + mTParametricArr[j][1] + ")";
        }
        mTResult += "<br/>";
      }
      if (mTParametricArr.length > mTMaxDisplay)
      {
        mTResult += "<a href=\"javascript:void(0)\" onClick=\"hidediv('" + i + "_collapse');showdiv('" + i + "_expand');\">" + mTCollapseName + "</a></div>";
      }

      mTResult += "<br/><br/>";
    }
    mTResult += "</font></body></html>";
  } else
  {
    mTResult += "<html><body></body></html>";
  }

  // Put the results to the page
  document.getElementById(idName).innerHTML = mTResult;
}

function setCookie (name, value, expires, path, domain, secure)
{
  alert("setting cookie '" + name + "' to value '" + value + "'");
  document.cookie = name + "=" + escape(value) +
                    ((expires) ? "; expires=" + expires : "") +
                    ((path) ? "; path=" + path : "") +
                    ((domain) ? "; domain=" + domain : "") +
                    ((secure) ? "; secure" : "");
}

function getCookie(name)
{
  // alert("getting cookie '" + name + "'");
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++)
  {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

