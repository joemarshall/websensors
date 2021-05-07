BASENAME="python_intro3_%s.md"

import ast
import glob
import re
import sys

class MarkdownVisitor(ast.NodeVisitor):
    def __init__(self,moduleName):
        self.parent_objects=[moduleName]
        self.short=False

    def parse_argblock(self,blockName,block):
        retVal="### "+blockName+"\n"
        # split block up into arguments which are
        # non-indented lines
        #   with indented lines for descriptions
        arguments=re.split("^(\S+)\s*\:\s*(\S+.*)$",block,flags=re.MULTILINE)
        arguments=arguments[1:]     
        for c in range(0,len(arguments),3):
            argname,argtype,desc= arguments[c:c+3]
            retVal+=f"* **{argname}**(*{argtype})*\n<br>"
            retVal+=desc.strip("\n")
            retVal+="\n"
        return retVal


    def parse_docstring(self,node):
        docs=ast.get_docstring(node)
        blocks=re.split("$\s*(\S+)\s*$\s*\-+\s*$",docs,flags=re.MULTILINE)
#        print(blocks)
        # first block is the main description
        # first line is the summary
        lines=blocks[0].split("\n")
        out_lines=""
        if self.short:
            # just print summary line
            out_lines+="    "*(len(self.parent_objects)-1)
            out_lines+="# "+lines[0]+"\n"
        else:
            out_lines+=blocks[0]

            # print the blocks
            c=1
            while c<len(blocks)-1:
                blockName=blocks[c]
                block=blocks[c+1]
                out_lines+="\n"+self.parse_argblock(blockName,block)
                c+=2
        return out_lines            

    def get_arg(self,node):
        return node.arg

    def is_static(self,node):
        for decorator in node.decorator_list:
            if decorator.id=='staticmethod':
                return True
        return False

    def get_decorators(self,node):
        if self.short:
            return "".join([f"    @{d.id}\n" for d in node.decorator_list])
        else:
            return "".join([f"@{d.id}\n" for d in node.decorator_list])

    def get_sig(self,node):
        args=node.args
        argList=[]
        for a in args.posonlyargs:
            argList.append(self.get_arg(a))
        for a in args.args:
            argList.append(self.get_arg(a))
        defaultStart=len(argList)-len(args.defaults)
        for n,d in enumerate(args.defaults):
            argList[defaultStart+n]+="="+str(d.value)            
        if len(args.kwonlyargs)>0:
            argList.append("**")
            for k,d in zip(args.kwonlyargs,args.kw_defaults):
                if d==None:
                    argList.append(self.get_arg(k))
                else:
                    argList.append(self.get_arg(k)+"="+str(d.value))                
        if self.short:
            return node.name+"("+",".join(argList)+")"
        else:
            return node.name+"(\n    "+",\n    ".join(argList)+"\n)"

    def visit_Module(self, node) :
        docstr=ast.get_docstring(node) 
        if not self.short:
            self.short=True
            print(f'<div id="{"_".join(self.parent_objects)}" class="moduletarget" markdown=1>')
            print(f"# Module {self.parent_objects[0]}")
            if docstr:
                docstr=docstr.replace("\\\`","\`")
                print(docstr)

            print("```python")
            self.generic_visit(node)
            print("```")
            print('</div>')
            self.short=False
            self.generic_visit(node)
        else:
            # module summary
            print(f'<div id="{"_".join(self.parent_objects)}" class="moduletarget" markdown=1>')
            targetPage=(BASENAME% self.parent_objects[0]).replace(".md",".html")
            print(f"# Module [{self.parent_objects[0]}]({targetPage})")
            if docstr:
                docstr=docstr.replace("\\\`","\`")
                print(docstr)
            print("```python")
            self.generic_visit(node)
            print("```")
            print('</div>')
        return


    def visit_ClassDef(self, node) :
        docstr=ast.get_docstring(node)
        if not docstr:
            # don't document undocumented (internal?) classes
            return
        docstr=docstr.replace("\\\`","\`")
        desc_lines=docstr.split("\n")

        self.parent_objects.append(node.name)
        class_name=".".join(self.parent_objects)

        # if we're not just showing a list of classes in a module, then
        # show the short and long descriptions of this class
        if not self.short:
            # link target for class
            print(f'<div id="{"_".join(self.parent_objects)}" class="classtarget" markdown=1>')
            print(f"\n# class {class_name} \n")
            # show short class description with links to methods
            self.short=True
            print("```python")
            print(f"class {node.name}:")
            retVal=super().generic_visit(node)
            print("```")
            self.short=False
            print(f'</div>')
            print("## Description")
            print("\n".join(desc_lines))
            # now show the full method descriptions
            retVal=super().generic_visit(node)
        else:
            # otherwise we probably just need to show a one line desc of us
            print(f"# {desc_lines[0]}")
            print(f"class {node.name}")            
            retVal=super().generic_visit(node)
            print("")
        self.parent_objects.pop()        
        return retVal

    def visit_FunctionDef(self, node) :
        level=len(self.parent_objects)
        docstr=ast.get_docstring(node)
        # only document things with valid docstrs
        if docstr and len(docstr)>0:
            if self.short:                
                print(self.parse_docstring(node),self.get_decorators(node),"    "*(level-1),"def ",self.get_sig(node),"\n",sep='')
            else:
                # link target for function
                print(f'<a id="{"_".join(self.parent_objects+[node.name])}" class="fntarget"></a>')
                # title with links to module (and class)
                print("\n","#"*level," ",end='',sep='')
                parentLinks=[]
                for c in range(len(self.parent_objects)):
                    parentLinks.append(f"[*{self.parent_objects[c]}*](#{ '_'.join(self.parent_objects[0:c+1])})")
                print(".".join(parentLinks),".",node.name,sep='')

                # actual display of fn def
                print("```python\n","# ",".".join(self.parent_objects+[node.name]),"\n",
                self.get_decorators(node),"def ",self.get_sig(node),"\n```\n",self.parse_docstring(node),sep='')
        # don't visit inside functions - we assume sub-functions are private
        return

    def visit_AsyncFunctionDef(self, node) :
        docstr=ast.get_docstring(node)
        docstr=docstr.replace("\\\`","\`")
        if docstr and len(docstr)>0:
            # only document things with valid docstrs
            print(".".join(self.parent_objects+[self.get_sig(node)]),self.parse_docstring(node))
        # don't visit inside functions - we assume sub-functions are private
        return

    def parse_Module(self,node):
        return self.generic_visit(node)


index=0

files=glob.glob("_includes/*_module.py")
for file in files:
    moduleName=re.match(".*/(.+)_module.py",file).group(1)
    contents=open(file).read()
    sys.stdout=open(BASENAME%moduleName,"w")
    tree=ast.parse(contents)
    print(f"""---
title: PyDocs - {moduleName} module
---
To use:
```python
import {moduleName} 

```
""")
    MarkdownVisitor(moduleName).visit(tree)
    print('<script src="{{\'/assets/js/pydoclink.js\'|relative_url}}"></script>')

# make index
index=0
sys.stdout=open(BASENAME%"0index","w")
print("""---
title: Extra built in modules
---
The web python we use here has a bunch of useful built in modules for doing things like capturing, replaying and filtering sensor data.

These pages contain documentation of the various modules. Click on function or class names for details of them.

""")

for file in files:
    index+=1
    moduleName=re.match(".*/(.+)_module.py",file).group(1)
    contents=open(file).read()

    tree=ast.parse(contents)
    v=MarkdownVisitor(moduleName)
    v.short=True
    v.visit(tree)
print('<script>window.isPydocIndex=true;</script>')
print('<script src="{{\'/assets/js/pydoclink.js\'|relative_url}}"></script>')
sys.stdout.close()

