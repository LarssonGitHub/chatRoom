const easterEggString = `<div id="easterEgg">
<iframe id="eastervid" disable autoplay width="560" height="315" src="https://www.youtube.com/embed/jQE66WA2s-A?autoplay=1 "
    title="YouTube video player" frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen controls="0" showinfo="0" disablekb="1"></iframe>
</div>`

function easterEggIsActivated(message) {
if (message !== "allyourbasearebelongtous") {
    return;
}

var walker = document.createTreeWalker(
    document.body,  // root node
    NodeFilter.SHOW_TEXT,  // filtering only text nodes
    null,
    false
);

const timer = setInterval(function(){   walker.nextNode()
    if (walker.currentNode.nodeValue.trim())  
      walker.currentNode.nodeValue = "ALL YOUR BASE ARE BELONG TO US!";}, 70);
if (!walker.nextNode()) clearInterval(timer);
}
