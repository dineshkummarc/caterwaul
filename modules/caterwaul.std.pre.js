caterwaul.configuration('std.qs',(function (qs_template,qse_template,literal_template,gensym_2_gnathyfw_azshho){return function (gensym_2_gnathyfw_azshhp){this.macro(qs_template,function (tree,gensym_2_gnathyfw_azshhq){return new this.ref(tree)}).macro(qse_template,function (tree,gensym_2_gnathyfw_azshhr){return new this.ref(this.macroexpand(tree))}).macro(literal_template,function (tree,gensym_2_gnathyfw_azshhs){return tree})}})(caterwaul.parse('qs[_]'),caterwaul.parse('qse[_]'),caterwaul.parse('literal[_]'))).tconfiguration('std.qs','std.qg',caterwaul.precompiled_internal((function (){var gensym_2_gnathyfw_azshif=caterwaul.parse('qg[_]');
return (function (gensym_2_gnathyfw_azshht){this.rmacro(gensym_2_gnathyfw_azshif,function (expression,gensym_2_gnathyfw_azshhu){return expression.as('(')})})})())).tconfiguration('std.qs std.qg','std.fn',caterwaul.precompiled_internal((function (){var gensym_2_gnathyfw_azshih=caterwaul.parse('fn[_][_]');
var gensym_2_gnathyfw_azshii=caterwaul.parse('qg[function (vars,gensym_2_gnathyfw_azshhx){return expression}]');
var gensym_2_gnathyfw_azshij=caterwaul.parse('fn_[_]');
var gensym_2_gnathyfw_azshik=caterwaul.parse('qg[function (gensym_2_gnathyfw_azshhz){return expression}]');
var gensym_2_gnathyfw_azshil=caterwaul.parse('fb[_][_]');
var gensym_2_gnathyfw_azshim=caterwaul.parse('fn[_t][fn_[fn[vars][e].apply(_t,arguments)]](this)');
var gensym_2_gnathyfw_azshin=caterwaul.parse('fb_[_]');
var gensym_2_gnathyfw_azshio=caterwaul.parse('fn[_t][fn_[fn_[e].apply(_t,arguments)]](this)');
var gensym_2_gnathyfw_azship=caterwaul.parse('fc[_][_]');
var gensym_2_gnathyfw_azshiq=caterwaul.parse('(fn[vars][body,undefined])');
var gensym_2_gnathyfw_azshir=caterwaul.parse('fc_[_]');
var gensym_2_gnathyfw_azshis=caterwaul.parse('(fn[vars][body,undefined])');
return (function (gensym_2_gnathyfw_azshhv){this.configure('std.qg').rmacro(gensym_2_gnathyfw_azshih,function (vars,expression,gensym_2_gnathyfw_azshhw){return gensym_2_gnathyfw_azshii.replace({vars:vars,expression:expression})}).rmacro(gensym_2_gnathyfw_azshij,function (expression,gensym_2_gnathyfw_azshhy){return gensym_2_gnathyfw_azshik.replace({expression:expression})}).rmacro(gensym_2_gnathyfw_azshil,function (vars,expression,gensym_2_gnathyfw_azshi0){return gensym_2_gnathyfw_azshim.replace({_t:this.gensym(),vars:vars,e:expression})}).rmacro(gensym_2_gnathyfw_azshin,function (expression,gensym_2_gnathyfw_azshi1){return gensym_2_gnathyfw_azshio.replace({_t:this.gensym(),e:expression})}).rmacro(gensym_2_gnathyfw_azship,function (vars,body,gensym_2_gnathyfw_azshi2){return gensym_2_gnathyfw_azshiq.replace({vars:vars,body:body})}).rmacro(gensym_2_gnathyfw_azshir,function (body,gensym_2_gnathyfw_azshi3){return gensym_2_gnathyfw_azshis.replace({body:body})})})})())).tconfiguration('std.qs std.qg std.fn','std.obj',caterwaul.precompiled_internal((function (){var gensym_2_gnathyfw_azshiu=caterwaul.parse('_/mb/_');
var gensym_2_gnathyfw_azshiv=caterwaul.parse('((function (_o,gensym_2_gnathyfw_azshhx){return _o.m&&(function (gensym_2_gnathyfw_azshhz){return _o.m.apply(_o,arguments)})}))(o)');
var gensym_2_gnathyfw_azshiw=caterwaul.parse('_/mb[_]');
var gensym_2_gnathyfw_azshix=caterwaul.parse('((function (_o,_m,gensym_2_gnathyfw_azshhx){return _o[_m]&&(function (gensym_2_gnathyfw_azshhz){return _o[_m].apply(_o,arguments)})}))(o,m)');
var gensym_2_gnathyfw_azshiy=caterwaul.parse('_/se._[_]');
var gensym_2_gnathyfw_azshiz=caterwaul.parse('((function (n,gensym_2_gnathyfw_azshhx){return b,n})).call(this,v)');
var gensym_2_gnathyfw_azshj0=caterwaul.parse('_/se[_]');
var gensym_2_gnathyfw_azshj1=caterwaul.parse('v/se._[b]');
var gensym_2_gnathyfw_azshj2=caterwaul.parse('_/re._[_]');
var gensym_2_gnathyfw_azshj3=caterwaul.parse('((function (n,gensym_2_gnathyfw_azshhx){return b})).call(this,v)');
var gensym_2_gnathyfw_azshj4=caterwaul.parse('_/re[_]');
var gensym_2_gnathyfw_azshj5=caterwaul.parse('v/re._[b]');
return (function (gensym_2_gnathyfw_azshi4){this.configure('std.qg std.fn').rmacro(gensym_2_gnathyfw_azshiu,(function (object,method,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshiv.replace({_o:this.gensym(),o:object,m:method})})).rmacro(gensym_2_gnathyfw_azshiw,(function (object,method,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshix.replace({_o:this.gensym(),_m:this.gensym(),o:object,m:method})})).rmacro(gensym_2_gnathyfw_azshiy,(function (v,n,b,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshiz.replace({b:b,n:n,v:v})})).rmacro(gensym_2_gnathyfw_azshj0,(function (v,b,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshj1.replace({b:b,v:v})})).rmacro(gensym_2_gnathyfw_azshj2,(function (v,n,b,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshj3.replace({b:b,n:n,v:v})})).rmacro(gensym_2_gnathyfw_azshj4,(function (v,b,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshj5.replace({b:b,v:v})}))})})())).tconfiguration('std.qs std.qg std.fn','std.bind',caterwaul.precompiled_internal((function (){var let_in=caterwaul.parse('let[_] in _');
var let_brackets=caterwaul.parse('let[_][_]');
var lets_in=caterwaul.parse('let*[_] in _');
var lets_brackets=caterwaul.parse('let*[_][_]');
var gensym_2_gnathyfw_azshja=caterwaul.parse('qg[function (gensym_2_gnathyfw_azshi6){var vars;\nreturn expression}].call(this)');
var gensym_2_gnathyfw_azshjc=caterwaul.parse('qg[function (vars,gensym_2_gnathyfw_azshi7){return e}].call(this,values)');
var gensym_2_gnathyfw_azshjd=caterwaul.parse('l[_] in _');
var gensym_2_gnathyfw_azshje=caterwaul.parse('l[_][_]');
var gensym_2_gnathyfw_azshjf=caterwaul.parse('_,where[_]');
var gensym_2_gnathyfw_azshjg=caterwaul.parse('l*[_] in _');
var gensym_2_gnathyfw_azshjh=caterwaul.parse('l*[_][_]');
var gensym_2_gnathyfw_azshji=caterwaul.parse('_,where*[_]');
return (function (gensym_2_gnathyfw_azshi5){this.configure('std.qg');
var lf=(function (gensym_2_gnathyfw_azshj7,gensym_2_gnathyfw_azshhx){return (function (gensym_2_gnathyfw_azshhz){return (function (form,gensym_2_gnathyfw_azshhx){return this.rmacro(form,l_expander)}).apply(gensym_2_gnathyfw_azshj7,arguments)})})(this),lsf=(function (gensym_2_gnathyfw_azshj8,gensym_2_gnathyfw_azshhx){return (function (gensym_2_gnathyfw_azshhz){return (function (form,gensym_2_gnathyfw_azshhx){return this.rmacro(form,l_star_expander)}).apply(gensym_2_gnathyfw_azshj8,arguments)})})(this),l_star_expander=(function (gensym_2_gnathyfw_azshj9,gensym_2_gnathyfw_azshhx){return (function (gensym_2_gnathyfw_azshhz){return (function (vars,expression,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshja.replace({vars:this.macroexpand(vars),expression:expression})}).apply(gensym_2_gnathyfw_azshj9,arguments)})})(this),l_expander=(function (gensym_2_gnathyfw_azshjb,gensym_2_gnathyfw_azshhx){return (function (gensym_2_gnathyfw_azshhz){return (function (vars,expression,gensym_2_gnathyfw_azshhx){return vars=this.macroexpand(vars).flatten(','),gensym_2_gnathyfw_azshjc.replace({vars:vars.map((function (n,gensym_2_gnathyfw_azshhx){return n[0]})).unflatten(),e:expression,values:vars.map((function (n,gensym_2_gnathyfw_azshhx){return n[1]})).unflatten()})}).apply(gensym_2_gnathyfw_azshjb,arguments)})})(this);
lf(gensym_2_gnathyfw_azshjd),lf(gensym_2_gnathyfw_azshje),lf(let_in),lf(let_brackets).rmacro(gensym_2_gnathyfw_azshjf,(function (expression,vars,gensym_2_gnathyfw_azshhx){return l_expander(vars,expression)}));
lsf(gensym_2_gnathyfw_azshjg),lsf(gensym_2_gnathyfw_azshjh),lsf(lets_in),lsf(lets_brackets).rmacro(gensym_2_gnathyfw_azshji,(function (expression,vars,gensym_2_gnathyfw_azshhx){return l_star_expander(vars,expression)}))})})()),{let_in:caterwaul.parse('let [_] in _'),let_brackets:caterwaul.parse('let [_][_]'),lets_in:caterwaul.parse('let*[_] in _'),lets_brackets:caterwaul.parse('let*[_][_]')}).tconfiguration('std.qs std.qg std.fn','std.lvalue',caterwaul.precompiled_internal((function (){var gensym_2_gnathyfw_azshjk=caterwaul.parse('_(_)=_');
var gensym_2_gnathyfw_azshjl=caterwaul.parse('base=qg[function (params,gensym_2_gnathyfw_azshi9){return value}]');
return (function (gensym_2_gnathyfw_azshi8){this.rmacro(gensym_2_gnathyfw_azshjk,(function (base,params,value,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshjl.replace({base:base,params:params,value:value})}))})})())).tconfiguration('std.qs std.qg std.fn','std.cond',caterwaul.precompiled_internal((function (){var gensym_2_gnathyfw_azshjn=caterwaul.parse('_,when[_]');
var gensym_2_gnathyfw_azshjo=caterwaul.parse('qg[l]&&qg[r]');
var gensym_2_gnathyfw_azshjp=caterwaul.parse('_,unless[_]');
var gensym_2_gnathyfw_azshjq=caterwaul.parse(' !qg[l]&&qg[r]');
return (function (gensym_2_gnathyfw_azshia){this.configure('std.qg').rmacro(gensym_2_gnathyfw_azshjn,(function (expr,cond,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshjo.replace({l:cond,r:expr})})).rmacro(gensym_2_gnathyfw_azshjp,(function (expr,cond,gensym_2_gnathyfw_azshhx){return gensym_2_gnathyfw_azshjq.replace({l:cond,r:expr})}))})})())).tconfiguration('std.qs std.qg std.fn','std.ref',caterwaul.precompiled_internal((function (){var gensym_2_gnathyfw_azshjs=caterwaul.parse('caterwaul');
return (function (gensym_2_gnathyfw_azshib){this.macro(gensym_2_gnathyfw_azshjs,(function (gensym_2_gnathyfw_azshhz){return new this.ref(this)}))})})())).tconfiguration('std.qs std.fn std.bind','std.string',caterwaul.precompiled_internal((function (){var gensym_2_gnathyfw_azshju=caterwaul.parse('_');
return (function (gensym_2_gnathyfw_azshic){this.rmacro(gensym_2_gnathyfw_azshju,(function (string,gensym_2_gnathyfw_azshhx){return string.is_string()&&/#\{[^\}]+\}/.test(string.data)&&(function (gensym_2_gnathyfw_azshi6){var q=string.data.charAt(0),s=string.as_escaped_string(),eq=new RegExp('\\\\'+q,'g'),strings=s.split(/#\{[^\}]+\}/),xs=[],result=new this.syntax('+');
return s.replace(/#\{([^\}]+)\}/g,(function (_,s,gensym_2_gnathyfw_azshhx){return xs.push(s),''})),this.util.map((function (gensym_2_gnathyfw_azshjv,gensym_2_gnathyfw_azshhx){return (function (gensym_2_gnathyfw_azshhz){return (function (x,i,gensym_2_gnathyfw_azshhx){return result.push(new this.syntax(q+(i<strings.length?strings[i]:'')+q)).push(new this.syntax('(',this.parse(xs[i].replace(eq,q))))}).apply(gensym_2_gnathyfw_azshjv,arguments)})})(this),xs),new this.syntax('(',result.push(new this.syntax(q+(xs.length<strings.length?strings[strings.length-1]:'')+q)).unflatten())}).call(this)}))})})())).configuration('std',function (gensym_2_gnathyfw_azshid){this.configure('std.qs std.qg std.bind std.lvalue std.cond std.fn std.obj std.ref std.string')});
