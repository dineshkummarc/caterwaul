caterwaul.configuration('std.qs',(function (qs_template,qse_template,literal_template,gensym_2_gmjt2wvy_7xdxur){return function (gensym_2_gmjt2wvy_7xdxus){this.macro(qs_template,function (tree,gensym_2_gmjt2wvy_7xdxut){return new this.ref(tree)}).macro(qse_template,function (tree,gensym_2_gmjt2wvy_7xdxuu){return new this.ref(this.macroexpand(tree))}).macro(literal_template,function (tree,gensym_2_gmjt2wvy_7xdxuv){return tree})}})(caterwaul.parse('qs[_]'),caterwaul.parse('qse[_]'),caterwaul.parse('literal[_]'))).tconfiguration('std.qs','std.qg',caterwaul.precompiled_internal((function (){var gensym_2_gmjt2wvy_7xdxvi=caterwaul.parse('qg[_]');
return (function (gensym_2_gmjt2wvy_7xdxuw){this.rmacro(gensym_2_gmjt2wvy_7xdxvi,function (expression,gensym_2_gmjt2wvy_7xdxux){return expression.as('(')})})})())).tconfiguration('std.qs std.qg','std.fn',caterwaul.precompiled_internal((function (){var gensym_2_gmjt2wvy_7xdxvk=caterwaul.parse('fn[_][_]');
var gensym_2_gmjt2wvy_7xdxvl=caterwaul.parse('qg[function (vars,gensym_2_gmjt2wvy_7xdxv0){return expression}]');
var gensym_2_gmjt2wvy_7xdxvm=caterwaul.parse('fn_[_]');
var gensym_2_gmjt2wvy_7xdxvn=caterwaul.parse('qg[function (gensym_2_gmjt2wvy_7xdxv2){return expression}]');
var gensym_2_gmjt2wvy_7xdxvo=caterwaul.parse('fb[_][_]');
var gensym_2_gmjt2wvy_7xdxvp=caterwaul.parse('fn[_t][fn_[fn[vars][e].apply(_t,arguments)]](this)');
var gensym_2_gmjt2wvy_7xdxvq=caterwaul.parse('fb_[_]');
var gensym_2_gmjt2wvy_7xdxvr=caterwaul.parse('fn[_t][fn_[fn_[e].apply(_t,arguments)]](this)');
var gensym_2_gmjt2wvy_7xdxvs=caterwaul.parse('fc[_][_]');
var gensym_2_gmjt2wvy_7xdxvt=caterwaul.parse('(fn[vars][body,undefined])');
var gensym_2_gmjt2wvy_7xdxvu=caterwaul.parse('fc_[_]');
var gensym_2_gmjt2wvy_7xdxvv=caterwaul.parse('(fn[vars][body,undefined])');
return (function (gensym_2_gmjt2wvy_7xdxuy){this.configure('std.qg').rmacro(gensym_2_gmjt2wvy_7xdxvk,function (vars,expression,gensym_2_gmjt2wvy_7xdxuz){return gensym_2_gmjt2wvy_7xdxvl.replace({vars:vars,expression:expression})}).rmacro(gensym_2_gmjt2wvy_7xdxvm,function (expression,gensym_2_gmjt2wvy_7xdxv1){return gensym_2_gmjt2wvy_7xdxvn.replace({expression:expression})}).rmacro(gensym_2_gmjt2wvy_7xdxvo,function (vars,expression,gensym_2_gmjt2wvy_7xdxv3){return gensym_2_gmjt2wvy_7xdxvp.replace({_t:this.gensym(),vars:vars,e:expression})}).rmacro(gensym_2_gmjt2wvy_7xdxvq,function (expression,gensym_2_gmjt2wvy_7xdxv4){return gensym_2_gmjt2wvy_7xdxvr.replace({_t:this.gensym(),e:expression})}).rmacro(gensym_2_gmjt2wvy_7xdxvs,function (vars,body,gensym_2_gmjt2wvy_7xdxv5){return gensym_2_gmjt2wvy_7xdxvt.replace({vars:vars,body:body})}).rmacro(gensym_2_gmjt2wvy_7xdxvu,function (body,gensym_2_gmjt2wvy_7xdxv6){return gensym_2_gmjt2wvy_7xdxvv.replace({body:body})})})})())).tconfiguration('std.qs std.qg std.fn','std.obj',caterwaul.precompiled_internal((function (){var gensym_2_gmjt2wvy_7xdxvx=caterwaul.parse('_/mb/_');
var gensym_2_gmjt2wvy_7xdxvy=caterwaul.parse('((function (_o,gensym_2_gmjt2wvy_7xdxv0){return _o.m&&(function (gensym_2_gmjt2wvy_7xdxv2){return _o.m.apply(_o,arguments)})}))(o)');
var gensym_2_gmjt2wvy_7xdxvz=caterwaul.parse('_/mb[_]');
var gensym_2_gmjt2wvy_7xdxw0=caterwaul.parse('((function (_o,_m,gensym_2_gmjt2wvy_7xdxv0){return _o[_m]&&(function (gensym_2_gmjt2wvy_7xdxv2){return _o[_m].apply(_o,arguments)})}))(o,m)');
var gensym_2_gmjt2wvy_7xdxw1=caterwaul.parse('_/se._[_]');
var gensym_2_gmjt2wvy_7xdxw2=caterwaul.parse('((function (n,gensym_2_gmjt2wvy_7xdxv0){return b,n})).call(this,v)');
var gensym_2_gmjt2wvy_7xdxw3=caterwaul.parse('_/se[_]');
var gensym_2_gmjt2wvy_7xdxw4=caterwaul.parse('v/se._[b]');
var gensym_2_gmjt2wvy_7xdxw5=caterwaul.parse('_/re._[_]');
var gensym_2_gmjt2wvy_7xdxw6=caterwaul.parse('((function (n,gensym_2_gmjt2wvy_7xdxv0){return b})).call(this,v)');
var gensym_2_gmjt2wvy_7xdxw7=caterwaul.parse('_/re[_]');
var gensym_2_gmjt2wvy_7xdxw8=caterwaul.parse('v/re._[b]');
return (function (gensym_2_gmjt2wvy_7xdxv7){this.configure('std.qg std.fn').rmacro(gensym_2_gmjt2wvy_7xdxvx,(function (object,method,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxvy.replace({_o:this.gensym(),o:object,m:method})})).rmacro(gensym_2_gmjt2wvy_7xdxvz,(function (object,method,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxw0.replace({_o:this.gensym(),_m:this.gensym(),o:object,m:method})})).rmacro(gensym_2_gmjt2wvy_7xdxw1,(function (v,n,b,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxw2.replace({b:b,n:n,v:v})})).rmacro(gensym_2_gmjt2wvy_7xdxw3,(function (v,b,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxw4.replace({b:b,v:v})})).rmacro(gensym_2_gmjt2wvy_7xdxw5,(function (v,n,b,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxw6.replace({b:b,n:n,v:v})})).rmacro(gensym_2_gmjt2wvy_7xdxw7,(function (v,b,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxw8.replace({b:b,v:v})}))})})())).tconfiguration('std.qs std.qg std.fn','std.bind',caterwaul.precompiled_internal((function (){var let_in=caterwaul.parse('let[_] in _');
var let_brackets=caterwaul.parse('let[_][_]');
var lets_in=caterwaul.parse('let*[_] in _');
var lets_brackets=caterwaul.parse('let*[_][_]');
var gensym_2_gmjt2wvy_7xdxwd=caterwaul.parse('qg[function (gensym_2_gmjt2wvy_7xdxv9){var vars;\nreturn expression}].call(this)');
var gensym_2_gmjt2wvy_7xdxwf=caterwaul.parse('qg[function (vars,gensym_2_gmjt2wvy_7xdxva){return e}].call(this,values)');
var gensym_2_gmjt2wvy_7xdxwg=caterwaul.parse('l[_] in _');
var gensym_2_gmjt2wvy_7xdxwh=caterwaul.parse('l[_][_]');
var gensym_2_gmjt2wvy_7xdxwi=caterwaul.parse('_,where[_]');
var gensym_2_gmjt2wvy_7xdxwj=caterwaul.parse('l*[_] in _');
var gensym_2_gmjt2wvy_7xdxwk=caterwaul.parse('l*[_][_]');
var gensym_2_gmjt2wvy_7xdxwl=caterwaul.parse('_,where*[_]');
return (function (gensym_2_gmjt2wvy_7xdxv8){this.configure('std.qg');
var lf=(function (gensym_2_gmjt2wvy_7xdxwa,gensym_2_gmjt2wvy_7xdxv0){return (function (gensym_2_gmjt2wvy_7xdxv2){return (function (form,gensym_2_gmjt2wvy_7xdxv0){return this.rmacro(form,l_expander)}).apply(gensym_2_gmjt2wvy_7xdxwa,arguments)})})(this),lsf=(function (gensym_2_gmjt2wvy_7xdxwb,gensym_2_gmjt2wvy_7xdxv0){return (function (gensym_2_gmjt2wvy_7xdxv2){return (function (form,gensym_2_gmjt2wvy_7xdxv0){return this.rmacro(form,l_star_expander)}).apply(gensym_2_gmjt2wvy_7xdxwb,arguments)})})(this),l_star_expander=(function (gensym_2_gmjt2wvy_7xdxwc,gensym_2_gmjt2wvy_7xdxv0){return (function (gensym_2_gmjt2wvy_7xdxv2){return (function (vars,expression,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxwd.replace({vars:this.macroexpand(vars),expression:expression})}).apply(gensym_2_gmjt2wvy_7xdxwc,arguments)})})(this),l_expander=(function (gensym_2_gmjt2wvy_7xdxwe,gensym_2_gmjt2wvy_7xdxv0){return (function (gensym_2_gmjt2wvy_7xdxv2){return (function (vars,expression,gensym_2_gmjt2wvy_7xdxv0){return vars=this.macroexpand(vars).flatten(','),gensym_2_gmjt2wvy_7xdxwf.replace({vars:vars.map((function (n,gensym_2_gmjt2wvy_7xdxv0){return n[0]})).unflatten(),e:expression,values:vars.map((function (n,gensym_2_gmjt2wvy_7xdxv0){return n[1]})).unflatten()})}).apply(gensym_2_gmjt2wvy_7xdxwe,arguments)})})(this);
lf(gensym_2_gmjt2wvy_7xdxwg),lf(gensym_2_gmjt2wvy_7xdxwh),lf(let_in),lf(let_brackets).rmacro(gensym_2_gmjt2wvy_7xdxwi,(function (expression,vars,gensym_2_gmjt2wvy_7xdxv0){return l_expander(vars,expression)}));
lsf(gensym_2_gmjt2wvy_7xdxwj),lsf(gensym_2_gmjt2wvy_7xdxwk),lsf(lets_in),lsf(lets_brackets).rmacro(gensym_2_gmjt2wvy_7xdxwl,(function (expression,vars,gensym_2_gmjt2wvy_7xdxv0){return l_star_expander(vars,expression)}))})})()),{let_in:caterwaul.parse('let [_] in _'),let_brackets:caterwaul.parse('let [_][_]'),lets_in:caterwaul.parse('let*[_] in _'),lets_brackets:caterwaul.parse('let*[_][_]')}).tconfiguration('std.qs std.qg std.fn','std.lvalue',caterwaul.precompiled_internal((function (){var gensym_2_gmjt2wvy_7xdxwn=caterwaul.parse('_(_)=_');
var gensym_2_gmjt2wvy_7xdxwo=caterwaul.parse('base=qg[function (params,gensym_2_gmjt2wvy_7xdxvc){return value}]');
return (function (gensym_2_gmjt2wvy_7xdxvb){this.rmacro(gensym_2_gmjt2wvy_7xdxwn,(function (base,params,value,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxwo.replace({base:base,params:params,value:value})}))})})())).tconfiguration('std.qs std.qg std.fn','std.cond',caterwaul.precompiled_internal((function (){var gensym_2_gmjt2wvy_7xdxwq=caterwaul.parse('_,when[_]');
var gensym_2_gmjt2wvy_7xdxwr=caterwaul.parse('qg[l]&&qg[r]');
var gensym_2_gmjt2wvy_7xdxws=caterwaul.parse('_,unless[_]');
var gensym_2_gmjt2wvy_7xdxwt=caterwaul.parse(' !qg[l]&&qg[r]');
return (function (gensym_2_gmjt2wvy_7xdxvd){this.configure('std.qg').rmacro(gensym_2_gmjt2wvy_7xdxwq,(function (expr,cond,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxwr.replace({l:cond,r:expr})})).rmacro(gensym_2_gmjt2wvy_7xdxws,(function (expr,cond,gensym_2_gmjt2wvy_7xdxv0){return gensym_2_gmjt2wvy_7xdxwt.replace({l:cond,r:expr})}))})})())).tconfiguration('std.qs std.qg std.fn','std.ref',caterwaul.precompiled_internal((function (){var gensym_2_gmjt2wvy_7xdxwv=caterwaul.parse('caterwaul');
return (function (gensym_2_gmjt2wvy_7xdxve){this.macro(gensym_2_gmjt2wvy_7xdxwv,(function (gensym_2_gmjt2wvy_7xdxv2){return new this.ref(this)}))})})())).tconfiguration('std.qs std.fn std.bind','std.string',caterwaul.precompiled_internal((function (){var gensym_2_gmjt2wvy_7xdxwx=caterwaul.parse('_');
return (function (gensym_2_gmjt2wvy_7xdxvf){this.rmacro(gensym_2_gmjt2wvy_7xdxwx,(function (string,gensym_2_gmjt2wvy_7xdxv0){return string.is_string()&&/#\{[^\}]+\}/.test(string.data)&&(function (gensym_2_gmjt2wvy_7xdxv9){var q=string.data.charAt(0),s=string.as_escaped_string(),eq=new RegExp('\\\\'+q,'g'),strings=s.split(/#\{[^\}]+\}/),xs=[],result=new this.syntax('+');
return s.replace(/#\{([^\}]+)\}/g,(function (_,s,gensym_2_gmjt2wvy_7xdxv0){return xs.push(s),''})),this.util.map((function (gensym_2_gmjt2wvy_7xdxwy,gensym_2_gmjt2wvy_7xdxv0){return (function (gensym_2_gmjt2wvy_7xdxv2){return (function (x,i,gensym_2_gmjt2wvy_7xdxv0){return result.push(new this.syntax(q+(i<strings.length?strings[i]:'')+q)).push(new this.syntax('(',this.parse(xs[i].replace(eq,q))))}).apply(gensym_2_gmjt2wvy_7xdxwy,arguments)})})(this),xs),new this.syntax('(',result.push(new this.syntax(q+(xs.length<strings.length?strings[strings.length-1]:'')+q)).unflatten())}).call(this)}))})})())).configuration('std',function (gensym_2_gmjt2wvy_7xdxvg){this.configure('std.qs std.qg std.bind std.lvalue std.cond std.fn std.obj std.ref std.string')});