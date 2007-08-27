GSA Parametric Search v1.3

Author: Fraser MacKenzie
Collaborators: Laurent Guiraud, Bruce Bordelon
Date Created: May 10, 2007
Last Updated: August 27, 2007

All source and documentation of the Parametric Navigation project is copyrighted by Google and made available under version 2.0 of the Apache License.  The license can be found in the file license.txt.

Google assumes no responsibility for this code and provides no support for it.

Changes Since v1.1:
- Selection of more than one meta data field is allowed
- Fixed selection of parametric values containing special characters (not including accented characters).
- Added new function for setting titles for each parametric grouping
- Added highlighting for parametric selections

Known Issues:
- selection of values with international characters (accented characters) does not work.
- selection of date values does not work.
- no ranged search

The GSA Parametric Search is a feature that uses the XML output of the GSA, in combination with javascript, to provide a means to visually filter results based upon meta data.

Here is the data flow for the GSA Parametric Search:

   1. Query is submitted to GSA
   2. Results are returned and XSLT is applied
   3. AJAX query for standard clustered results is submitted to GSA
   4. Standard clustered results are returned and displayed
   5. AJAX query for parametric search is submitted to GSA
   6. XML is returned, parsed, and parametric results are displayed


Functions:

- mTAddField(metaTagName, metaTagDelimiter)

    * metaTagName is the name of the meta tag to display.
    * metaTagDelimiter is a delimiter that will be used to split up values into multiple values. An empty meta tag delimter indicates that the meta tag value is not to be split up.}

- mTSetDisplayName(metaTagName, metaTagDisplayName)

    * metaTagname is the name of the meta tag that you wish to setup a label for.
    * metTagDisplayName is the label value for the meta tag.

- mTCombineField(combineFrom, combineTo)

    * combineFrom field is the name of the meta tag that you wish to take all the values from.
    * combineTo field is the name of the meta tag that you wish to place all the values in.

- mTLoad(id, mTURL)

    * the id is the div id in the xslt that the parametric results will be placed into.
    * mTURL is the complete set of URL parameters that have to be passed to the javascript, in order to retain all the appropriate search criteria. If you are calling this from a GSA Frontend, then you will need to use the {$search_url} variable.

- mTSetHeader(headerName)

    * the header name to display at the top of the parametric results.

- mTSetShowNumbers(show)

    * whether or not to display the numbers beside each parametric value in a grouping.

- mTSetHost(hostName)

    * The host name to do the parametric query on.

- mTSetShowNumbers(show)

    * whether or not to display the numbers beside each parametric value in a grouping.

- mTSetExpandName(expandName)

    * expandName is the label for the expand link.

- mTSetCollapseName(collapseName)

    * collapseName is the label for the collapse link.

- mTSetMaxDisplay(maxDisplay)

    * set the maximum number of meta data values to display for each of the meta data names.

- mTSort(metaTagName, sortBy)

    * set the sort type and order for a specific meta tag name.

- mTSetAllPlacement(allName, allLocation)

    * allName is the label to be given to the all link.
    * allLocation is the location to place the all link. It can be either header or list.


Installation Instructions:


Step 1
~~~~~~

The external javascript is found in the googleParametric.js file.  It can be included into an XSLT (right before the body tag for the results page) by doing the following:

<!-- Meta Tag Cluster code start -->
 <script language='javascript' src='http://YOUR_HOST/googleParametric.js'>//Comment</script>
<!-- Meta Tag Cluster code end -->

You will also have to change YOUR_HOST to the host name where you have placed the googleParametric.js file.

OR

If you do not wish, or do not have an external machine to import the javascript code from, you must import the following file:

googleParametricInclude.txt

into your XSLT (right before the body tag for the results page).


Step 2
~~~~~~

Call mTLoad in the body onLoad portion of the XSLT similar to this:

<body onLoad="mTLoad('mtParametric', '{$search_url}', 1);" dir="ltr">


Step 3
~~~~~~

Place any function calls above, before the mTLoad statement if you require them.
For example:

<body onLoad="mTSetHeader('Parametric Navigation'); mTSetHost('GSA_HOST_NAME'); mTSetMaxDisplay(5); mTSort('keywords', 'alpha asc'); mTLoad('mtParametric', '{$search_url}', 1);" dir="ltr">


Step 4
~~~~~~

Change any occurrences of GSA_HOST_NAME to the hostname for your Google Search Appliance (GSA).


Step 5
~~~~~~

Create the following xsl template inside your xslt:

<xsl:template name="my_parametric_navigation">
  <span class="p">
    <xsl:text disable-output-escaping="yes"> &lt;!-- Please enter html code below. --&gt;</xsl:text>

 <!-- ********************************************************************** -->

  <div name="mtParametric" id="mtParametric"><font size="1"><br/><br/><br/><br/>
&#160;&#160;&#160;Loading parametric...</font></div>

 <!-- ********************************************************************** -->

  </span>
</xsl:template>


Step 6
~~~~~~

Call the my_parametric_navigation template:

<xsl:call-template name="my_parametric_navigation">
</xsl:call-template>

wherever you want to display the parametric navigation results.

