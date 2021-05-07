

var links=[];

// find all classes
var classes = document.querySelectorAll(".classtarget");

classes.forEach( function(el){
    // find the functions under this
    var classid=el.id;
    var fns=el.querySelectorAll(".nf");
    fns.forEach( function(fn){
        var link=document.createElement("a")
        link.href="#"+classid+"_"+fn.textContent;
        links.push([link,fn]);
        fn.parentElement.insertBefore(link,fn);
    });
});

// find all modules
var modules= document.querySelectorAll(".moduletarget");
modules.forEach( function(mod){
    var module_name=mod.id;
    var linkStart="";
    if(window.isPydocIndex)
    {
        linkStart=window.location.pathname.replace("0index",module_name);
    }

    var class_and_function_names=mod.querySelectorAll(".nc,.nf");
    var lastClass;
    class_and_function_names.forEach( function(classOrFn){
        if(classOrFn.className=="nc")
        {
            lastClass=classOrFn.textContent;
            // add link to classdef, which will be 
            // module_class
            var classLink=document.createElement('a');
            classLink.href=linkStart+"#"+module_name+"_"+lastClass;
            classOrFn.parentElement.insertBefore(classLink,classOrFn);
            links.push([classLink,classOrFn]);
        }else if(classOrFn.className=="nf")
        {
            // check if in class by indent of this line
            let prev_node=classOrFn.previousSibling;
            let indent=0;
            let found_indent=false;
            for(let c=0;c<5 && !found_indent;c++){
                let tc=prev_node.textContent;
                for(let d=tc.length-1;d>=0;d--)
                {
                    if(tc[d]==" ")
                    {
                        indent+=1;
                    }else if(tc[d]=='\n')
                    {
                        found_indent=true;
                        break;
                    }else
                    {
                        indent=0;
                    }
                }
                prev_node=prev_node.previousSibling;
                if(!prev_node)break;
            }
            if(indent!=0)
            {
                // add link to function in class (module_class_fn)
                var link=document.createElement("a")
                link.href=linkStart+"#"+module_name+"_"+lastClass+"_"+classOrFn.textContent;
                classOrFn.parentElement.insertBefore(link,classOrFn);
                links.push([link,classOrFn]);
            }else
            {
                // add link to module level function (module_fn)
                var link=document.createElement("a")
                link.href=linkStart+"#"+module_name+"_"+classOrFn.textContent;
                classOrFn.parentElement.insertBefore(link,classOrFn);
                links.push([link,classOrFn]);
            }
        }
    });

});

// fix up parents
links.forEach(function(linkAndFn)
{
    linkAndFn[0].appendChild(linkAndFn[1]);
});
