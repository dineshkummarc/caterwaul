caterwaul.configuration('continuation.core',function (gensym_2_gnathj19_a2ufvg){this.shallow('continuation',{})}).tconfiguration('std','continuation.unwind',caterwaul.precompiled_internal((function (){var gensym_2_gnathj19_a2ufvq=caterwaul.parse('unwind_protect[_][_]');
var gensym_2_gnathj19_a2ufvt=caterwaul.parse('_f((function (gensym_2_gnathj19_a2ufvr){return (function (){return (function (e){return _escape}).apply(gensym_2_gnathj19_a2ufvr,arguments)})})(this),(function (gensym_2_gnathj19_a2ufvs){return (function (){return (function (){return _body}).apply(gensym_2_gnathj19_a2ufvs,arguments)})})(this))');
var gensym_2_gnathj19_a2ufvu=caterwaul.parse('caterwaul.continuation.unwind_protect');
var gensym_2_gnathj19_a2ufvv=caterwaul.parse('unwind[_]');
var gensym_2_gnathj19_a2ufvw=caterwaul.parse('caterwaul.continuation.unwind(_e)');
return (function (gensym_2_gnathj19_a2ufvh){((function (_){return _.unwind_protect=function (escape,f,gensym_2_gnathj19_a2ufvi){try {return f()}catch (e){return escape(e)}},_.unwind=function (e,gensym_2_gnathj19_a2ufvj){throw e},_})).call(this,this.configure('std.fn continuation.core').continuation);
this.rmacro(gensym_2_gnathj19_a2ufvq,(function (escape,body){return gensym_2_gnathj19_a2ufvt.replace({_f:gensym_2_gnathj19_a2ufvu,_escape:escape,_body:body})})).rmacro(gensym_2_gnathj19_a2ufvv,(function (e){return gensym_2_gnathj19_a2ufvw.replace({_e:e})}))})})())).tconfiguration('std','continuation.cps',caterwaul.precompiled_internal((function (){var gensym_2_gnathj19_a2ufvy=caterwaul.parse('(function (_){return _f}).call(this,_c)');
var gensym_2_gnathj19_a2ufvz=caterwaul.clone('std.qs std.qg std.bind std.lvalue std.cond std.fn std.obj std.ref std.string std');
var gensym_2_gnathj19_a2ufw0=caterwaul.parse('_f[_v][_b]');
var gensym_2_gnathj19_a2ufw1=caterwaul.parse('fb');
var gensym_2_gnathj19_a2ufw2=caterwaul.parse('fn');
var gensym_2_gnathj19_a2ufw4=caterwaul.parse('l/_form[_,_< -_] in _');
var gensym_2_gnathj19_a2ufw5=gensym_2_gnathj19_a2ufvz;
var gensym_2_gnathj19_a2ufw6=caterwaul.parse('l/_form[_< -_] in _');
var gensym_2_gnathj19_a2ufw7=gensym_2_gnathj19_a2ufvz;
var gensym_2_gnathj19_a2ufw8=caterwaul.parse('l/_form[_,_< -_][_]');
var gensym_2_gnathj19_a2ufw9=gensym_2_gnathj19_a2ufvz;
var gensym_2_gnathj19_a2ufwa=caterwaul.parse('l/_form[_< -_][_]');
var gensym_2_gnathj19_a2ufwb=gensym_2_gnathj19_a2ufvz;
var gensym_2_gnathj19_a2ufw3=caterwaul.parse('l/cps[cs][_f]');
var gensym_2_gnathj19_a2ufwc=caterwaul.parse('_/_form[_]');
var gensym_2_gnathj19_a2ufwd=caterwaul.parse('_f/_form._[_b]');
var gensym_2_gnathj19_a2ufwe=caterwaul.parse('_/_form._[_]');
var gensym_2_gnathj19_a2ufwf=caterwaul.parse('(function (_){return _f}).call(this,_c)');
var gensym_2_gnathj19_a2ufwg=gensym_2_gnathj19_a2ufvz;
var gensym_2_gnathj19_a2ufwh=caterwaul.parse('_f[_v][_b]');
var gensym_2_gnathj19_a2ufwi=caterwaul.parse('fb');
var gensym_2_gnathj19_a2ufwj=caterwaul.parse('fn');
var gensym_2_gnathj19_a2ufwk=caterwaul.parse('cps');
var gensym_2_gnathj19_a2ufwl=caterwaul.parse('cpb');
var gensym_2_gnathj19_a2ufwm=caterwaul.parse('cps');
var gensym_2_gnathj19_a2ufwn=caterwaul.parse('cpb');
return (function (gensym_2_gnathj19_a2ufvk){(function (){var cps_convert=(function (v,f,b,bound){return gensym_2_gnathj19_a2ufvy.replace({_c:gensym_2_gnathj19_a2ufvz.macroexpand(gensym_2_gnathj19_a2ufw0.replace({_f:bound?gensym_2_gnathj19_a2ufw1:gensym_2_gnathj19_a2ufw2})).replace({_v:v.as('(')[0],_b:b}),_f:f})}),l_cps_def=(function (t,form,bound){return (function (inductive,base){return t.rmacro(gensym_2_gnathj19_a2ufw4.replace({_form:form}),inductive).rmacro(gensym_2_gnathj19_a2ufw5.parse(('let/'+(form.serialize())+'[_, _ <- _] in _')),inductive).rmacro(gensym_2_gnathj19_a2ufw6.replace({_form:form}),base).rmacro(gensym_2_gnathj19_a2ufw7.parse(('let/'+(form.serialize())+'[   _ <- _] in _')),base).rmacro(gensym_2_gnathj19_a2ufw8.replace({_form:form}),inductive).rmacro(gensym_2_gnathj19_a2ufw9.parse(('let/'+(form.serialize())+'[_, _ <- _][_]')),inductive).rmacro(gensym_2_gnathj19_a2ufwa.replace({_form:form}),base).rmacro(gensym_2_gnathj19_a2ufwb.parse(('let/'+(form.serialize())+'[   _ <- _][_]')),base)}).call(this,(function (cs,v,f,b){return gensym_2_gnathj19_a2ufw3.replace({cs:cs,_f:cps_convert(v,f,b,bound)})}),(function (v,f,b){return cps_convert(v,f,b,bound)}))}),cps_def=(function (t,form,bound){return t.rmacro(gensym_2_gnathj19_a2ufwc.replace({_form:form}),(function (f,b){return gensym_2_gnathj19_a2ufwd.replace({_form:form,_f:f,_b:b})})).rmacro(gensym_2_gnathj19_a2ufwe.replace({_form:form}),(function (f,v,b){return gensym_2_gnathj19_a2ufwf.replace({_c:gensym_2_gnathj19_a2ufwg.macroexpand(gensym_2_gnathj19_a2ufwh.replace({_f:bound?gensym_2_gnathj19_a2ufwi:gensym_2_gnathj19_a2ufwj})).replace({_v:v,_b:b}),_f:f})}))});
return ((function (_){return cps_def(_,gensym_2_gnathj19_a2ufwk,false),cps_def(_,gensym_2_gnathj19_a2ufwl,true),l_cps_def(_,gensym_2_gnathj19_a2ufwm,false),l_cps_def(_,gensym_2_gnathj19_a2ufwn,true),_})).call(this,this.configure('std.fn continuation.core'))}).call(this)})})())).tconfiguration('std','continuation.delimited',caterwaul.precompiled_internal((function (){var gensym_2_gnathj19_a2ufwp=caterwaul.parse('call/cc[_]');
var gensym_2_gnathj19_a2ufwq=caterwaul.parse('qg[caterwaul.continuation.call_cc.call(this,_f)]');
var gensym_2_gnathj19_a2ufwr=caterwaul.parse('call/tail[_(_)]');
var gensym_2_gnathj19_a2ufws=caterwaul.parse('qg[caterwaul.continuation.call_tail.call(_f,_args)]');
return (function (gensym_2_gnathj19_a2ufvl){(function (magic){return ((function (_){return _.call_cc=function (f,gensym_2_gnathj19_a2ufvm){var escaped=false,cc=function (x,gensym_2_gnathj19_a2ufvn){escaped=true;
throw x},frame={magic:magic,continuation:f,parameters:[cc]};
try {while ((frame=frame.continuation.apply(this,frame.parameters))&&frame&&frame.magic===magic);
return frame}catch (e){if (escaped)return e;
else throw e}},_.call_tail=(function (){return {magic:magic,continuation:this,parameters:arguments}}),_})).call(this,this.continuation)}).call(this,this.configure('std.qg continuation.core').continuation.magic=this.magic('continuation.delimited'));
this.rmacro(gensym_2_gnathj19_a2ufwp,(function (f){return gensym_2_gnathj19_a2ufwq.replace({_f:f})})).rmacro(gensym_2_gnathj19_a2ufwr,(function (f,args){return gensym_2_gnathj19_a2ufws.replace({_f:f,_args:args})}))})})())).configuration('continuation',function (gensym_2_gnathj19_a2ufvo){this.configure('continuation.core continuation.unwind continuation.cps continuation.delimited')});