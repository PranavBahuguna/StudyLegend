// Loads an XML file and returns the XML data.
function loadXMLDoc(filename)
{
    if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    } else { // code for IE5 and IE6
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseXML;
}

// Generates a traversible menu of links given an appropriate xml file.
function generateMenuFromFile(htmlContainer, xmlFile) {
    links = loadXMLDoc(xmlFile);
    contents = links.getElementsByTagName("contents")[0];
    generateMenu(htmlContainer, contents);
}

// Recursive function that generates a menu from the contents of an xml file.
function generateMenu(htmlContainer, xmlMenu) {

    htmlContainer.innerHTML += "<ul></ul>";
    htmlContainer = htmlContainer.getElementsByTagName('ul')[0];

    // Obtains the topMenu node that contains the current node and sets the
    // border color to the topMenu color attribute.
    if (xmlMenu.nodeName != 'contents') {
        topNode = xmlMenu;
        while (topNode.nodeName != 'topMenu') {
            topNode = topNode.parentNode;
        }
        htmlContainer.setAttribute('style', 'border-color:'
            + topNode.getAttribute('color'));
    }

    // Obtains all menus and items from the xmlMenu.
    var menus = [];
    var items = [];
    for (var i = 0; i < xmlMenu.childNodes.length; i++) {
        if (xmlMenu.childNodes[i].nodeName == 'menu'
            || xmlMenu.childNodes[i].nodeName == 'topMenu')
        {
            menus.push(xmlMenu.childNodes[i]);
        }
        else if (xmlMenu.childNodes[i].nodeName == 'item') {
            items.push(xmlMenu.childNodes[i]);
        }
    }

    // Writes each menu in the menus array into the htmlContainer and calls
    // generateMenu on the new menu.
    for (var i = 0; i < menus.length; i++) {
        htmlContainer.innerHTML += '<li><a href='
            + menus[i].getAttribute('href')
            + ' target="main-panel" class="menu collapsed">'
            + menus[i].childNodes[1].innerHTML + '</a></li>';
        generateMenu(htmlContainer.childNodes[i],
            menus[i].getElementsByTagName('items')[0]);
    }
    // Adds remaining items into the htmlContainer.
    for (var i = 0; i < items.length; i++) {
        htmlContainer.innerHTML += '<li><a href='
            + items[i].getAttribute('href')
            + ' target="main-panel" class="item">'
            + items[i].childNodes[1].innerHTML + '</a></li>';
    }
}
