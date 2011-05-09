caterwaul.js_base() (caterwaul.precompiled_internal( (function( ) {var gensym_1_gnhz4d3j_1sttc9=new caterwaul.syntax( '()' ,new caterwaul.syntax( '.' ,new caterwaul.syntax( 'caterwaul' ) ,new caterwaul.syntax( 'precompiled_internal' ) ) ,new caterwaul.syntax( '_x' ) ) ;
var gensym_1_gnhz4d3j_1sttca=new caterwaul.syntax( 'new' , /* unary , node */new caterwaul.syntax( '()' ,new caterwaul.syntax( '.' ,new caterwaul.syntax( 'caterwaul' ) ,new caterwaul.syntax( 'syntax' ) ) ,new caterwaul.syntax( '_name' ) ) ) ;
var gensym_1_gnhz4d3j_1sttcb=new caterwaul.syntax( 'new' , /* unary , node */new caterwaul.syntax( '()' ,new caterwaul.syntax( '.' ,new caterwaul.syntax( 'caterwaul' ) ,new caterwaul.syntax( 'syntax' ) ) ,new caterwaul.syntax( ',' ,new caterwaul.syntax( '_name' ) ,new caterwaul.syntax( '_children' ) ) ) ) ;
return(function($) {$.precompile= (function(f) {return(function( ) {var nontrivial_function_pattern=$.parse( 'function (_args) {_body}' ) ,trivial_function_pattern=$.parse( 'function ()      {_body}' ) ,nontrivial_function_gensym_template=$.parse( 'function (_args, _gensym) {_body}' ) ,trivial_function_gensym_template=$.parse( 'function (_gensym)        {_body}' ) ,nontrivial_gensym_detection_pattern=nontrivial_function_gensym_template,trivial_gensym_detection_pattern=trivial_function_gensym_template,annotate_macro_generator= (function(template) {return(function(references) {return(function(match) {return(function( ) {var s=$.gensym() ,result=template.replace( {_args:match._args,_gensym:s,_body:annotate_functions_in(match._body,references) } ) ;
return( (function(it) {return(references[s] = {tree:result} ) ,it} ) .call(this, (result) ) ) } ) .call(this) } ) } ) } ) ,mark_nontrivial_function_macro=annotate_macro_generator(nontrivial_function_gensym_template) ,mark_trivial_function_macro=annotate_macro_generator(trivial_function_gensym_template) ,annotate_functions_in= (function(tree,references) {return $.macroexpand(tree,$.macro(trivial_function_pattern,mark_trivial_function_macro(references) ) ,$.macro(nontrivial_function_pattern,mark_nontrivial_function_macro(references) ) ) } ) ,function_key= (function(tree) {return(function( ) {var matches=nontrivial_gensym_detection_pattern.match(tree) ||trivial_gensym_detection_pattern.match(tree) ;
return( ( (matches) && (matches._gensym.data) ) ) } ) .call(this) } ) ,mark_as_compiled= (function(references,k,tree,environment) {return( (k&&references[k] ) && ( (function(it) {return(references[k] .compiled=tree,references[k] .environment=environment) ,it} ) .call(this, ( (function(it) {return( ( (references[k] .compiled) && ( (function( ) {throw new Error( ( 'detected multiple compilations of ' + (references[k] .tree.serialize() ) + '' ) ) } ) .call(this) ) ) ) ,it} ) .call(this, (references[k] ) ) ) ) ) ) } ) ,wrapped_compile= (function(original,references) {return(function(tree,environment) {return(function(it) {return(mark_as_compiled(references,function_key(tree) ,tree,$.merge( { } ,this._environment|| { } ,environment) ) ) ,it} ) .call(this, (original.call(this,tree,environment) ) ) } ) } ) ,signal_already_compiled= (function(tree) {return gensym_1_gnhz4d3j_1sttc9.replace( {_x:tree} ) } ) ,closure_template=$.parse( '(function () {_vars; return (_value)}).call(this)' ) ,closure_variable_template=$.parse( 'var _var = _value' ) ,closure_null_template=$.parse( 'null' ) ,escape_string= (function(s) {return'\'' +s.replace( /\\/g , '\\\\' ) .replace( /\n/g , '\\n' ) .replace( /'/g , '\\\'' ) + '\'' } ) ,serialize_syntax= (function(value) {return value.length===0?gensym_1_gnhz4d3j_1sttca.replace( {_name:escape_string(value.data) } ) : (function( ) {var children=new $.syntax( ',' , (function( ) {for(var gensym_1_gnhz4d3j_1sttbs= (value) ,gensym_1_gnhz4d3j_1sttbt= [ ] ,gensym_1_gnhz4d3j_1sttbq=0,gensym_1_gnhz4d3j_1sttbr=gensym_1_gnhz4d3j_1sttbs.length,it;
gensym_1_gnhz4d3j_1sttbq<gensym_1_gnhz4d3j_1sttbr;
 ++gensym_1_gnhz4d3j_1sttbq)it=gensym_1_gnhz4d3j_1sttbs[gensym_1_gnhz4d3j_1sttbq] ,gensym_1_gnhz4d3j_1sttbt.push(serialize_syntax(it) ) ;
return gensym_1_gnhz4d3j_1sttbt} ) .call(this) ) .unflatten() ;
return(gensym_1_gnhz4d3j_1sttcb.replace( {_name:escape_string(value.data) ,_children:children} ) ) } ) .call(this) } ) ,serialize_ref= (function(value,name,seen) {return!value? ( '' + (value) + '' ) :value.constructor===$.syntax?seen[value.id() ] || (function(it) {return(serialize_syntax(value) ) } ) .call(this, ( (seen[value.id() ] =name) ) ) : (function( ) {throw new Error( ( 'syntax ref value is not serializable: ' + (value) + '' ) ) } ) .call(this) } ) ,single_variable= (function(name,value) {return closure_variable_template.replace( {_var:name,_value:value} ) } ) ,names_and_values_for= (function(environment) {return(function( ) {var x= (environment) ,gensym_1_gnhz4d3j_1sttbt= [ ] ;
for(var it in x)Object.prototype.hasOwnProperty.call(x,it) &&gensym_1_gnhz4d3j_1sttbt.push(single_variable(it,environment[it] ) ) ;
return gensym_1_gnhz4d3j_1sttbt} ) .call(this) } ) ,tree_variables= (function(tree) {return(function( ) {var vars= [ ] ,seen= { } ;
return( (function(it) {return(tree.reach( (function(n) {return( (n&&n.binds_a_value) && (vars.push(single_variable(n.data,serialize_ref(n.value,n.data,seen) ) ) ) ) } ) ) ) ,it} ) .call(this, (vars) ) ) } ) .call(this) } ) ,variables_for= (function(tree,environment) {return(function( ) {var all_variables=names_and_values_for(environment) .concat(tree_variables(tree) ) ;
return(all_variables.length?new $.syntax( ';' ,all_variables) :closure_null_template) } ) .call(this) } ) ,precompiled_closure= (function(tree,environment) {return closure_template.replace( {_vars:variables_for(tree,environment) ,_value:tree} ) } ) ,precompiled_function= (function(tree,environment) {return signal_already_compiled(precompiled_closure(tree,environment) ) } ) ,substitute_precompiled= (function(references) {return(function(match) {return(function( ) {var ref=references[match._gensym.data] ;
return( ( (ref&&ref.compiled) && (precompiled_function(ref.compiled,ref.environment) ) ) ) } ) .call(this) } ) } ) ,perform_substitution= (function(references,tree) {return $.macroexpand(tree,$.macro(trivial_gensym_detection_pattern,nontrivial_gensym_detection_pattern,substitute_precompiled(references) ) ) } ) ,reconstruct_original= (function(references,match) {return(function( ) {var new_match= {_body:remove_gensyms(references,match._body) ,_args:match._args} ;
return(match._args?nontrivial_function_pattern.replace(new_match) :trivial_function_pattern.replace(new_match) ) } ) .call(this) } ) ,remove_referenced_gensyms= (function(references) {return(function(match) {return(function( ) {var ref=references[match._gensym.data] ;
return( ( (ref&&ref.tree) && (reconstruct_original(references,match) ) ) ) } ) .call(this) } ) } ) ,remove_gensyms= (function(references,tree) {return $.macroexpand(tree,$.macro(trivial_gensym_detection_pattern,nontrivial_gensym_detection_pattern,remove_referenced_gensyms(references) ) ) } ) ,annotated_caterwaul= (function(caterwaul,references) {return(function(it) {return(it.compile=wrapped_compile(it.compile,references) ) ,it} ) .call(this, (caterwaul.clone() ) ) } ) ,trace_execution= (function(caterwaul,f) {return(function( ) {var references= { } ,annotated=annotate_functions_in($.parse(f) ,references) ;
return( (function(it) {return(caterwaul.compile(annotated, {caterwaul:annotated_caterwaul(caterwaul,references) } ) () ) ,it} ) .call(this, ( {references:references,annotated:annotated} ) ) ) } ) .call(this) } ) ;
return( (function( ) {var traced=trace_execution(this,f) ;
return(this.compile(remove_gensyms(traced.references,perform_substitution(traced.references,traced.annotated) ) ) ) } ) .call(this) ) } ) .call(this) } ) } ) } ) .call(this) ) ) (caterwaul) ;
caterwaul.js_base() (caterwaul.precompiled_internal( (function( ) {null;
return(function($) {$.tracer= (function(before,after) {return(function( ) {var anon=$.anonymizer( 'E' , 'S' , 'H' , 'D' , 'I' ) ,rule= (function(p,e) {return $.macro(anon(p) ,e.constructor===Function? (function(match) {return this.expand(e.call(this,match) ) } ) :anon(e) ) } ) ,expression_macros= (function( ) {var assignment_operator= (function(op) {return(function( ) {var t= (function(x) {return anon(x) .replace( { '=' :op} ) } ) ,rule= (function(x,y) {return $.macro(t(x) ,t(y) ) } ) ;
return( [rule( 'E[_x     = _y]' , 'H[_, _x           = E[_y]]' ) ,rule( 'E[_x[_y] = _z]' , 'H[_, E[_x][E[_y]] = E[_z]]' ) ,rule( 'E[_x._y  = _z]' , 'H[_, E[_x]._y     = E[_z]]' ) ] ) } ) .call(this) } ) ,binary_operator= (function(op) {return $.macro(anon( 'E[_x + _y]' ) .replace( { '+' :op} ) ,anon( 'H[_, E[_x] + E[_y]]' ) .replace( { '+' :op} ) ) } ) ,unary_operator= (function(op) {return $.macro(anon( 'E[+_x]' ) .replace( { 'u+' : ( 'u' + (op) + '' ) } ) ,anon( 'H[_, +E[_x]]' ) .replace( { 'u+' : ( 'u' + (op) + '' ) } ) ) } ) ,qw= (function(s) {return s.split( /\s+/ ) } ) ;
return( [rule( 'E[_x]' , 'H[_, _x]' ) ,rule( 'E[]' , '' ) , (function( ) {for(var gensym_1_gnhz4d3j_1sttbs= (qw( '= += -= *= /= %= &= |= ^= <<= >>= >>>=' ) ) ,gensym_1_gnhz4d3j_1sttbt= [ ] ,gensym_1_gnhz4d3j_1sttbq=0,gensym_1_gnhz4d3j_1sttbr=gensym_1_gnhz4d3j_1sttbs.length,it;
gensym_1_gnhz4d3j_1sttbq<gensym_1_gnhz4d3j_1sttbr;
 ++gensym_1_gnhz4d3j_1sttbq)it=gensym_1_gnhz4d3j_1sttbs[gensym_1_gnhz4d3j_1sttbq] ,gensym_1_gnhz4d3j_1sttbt.push(assignment_operator(it) ) ;
return gensym_1_gnhz4d3j_1sttbt} ) .call(this) , (function( ) {for(var gensym_1_gnhz4d3j_1sttbs= (qw( '() [] + - * / % < > <= >= == != === !== in instanceof ^ & | && ||' ) ) ,gensym_1_gnhz4d3j_1sttbt= [ ] ,gensym_1_gnhz4d3j_1sttbq=0,gensym_1_gnhz4d3j_1sttbr=gensym_1_gnhz4d3j_1sttbs.length,it;
gensym_1_gnhz4d3j_1sttbq<gensym_1_gnhz4d3j_1sttbr;
 ++gensym_1_gnhz4d3j_1sttbq)it=gensym_1_gnhz4d3j_1sttbs[gensym_1_gnhz4d3j_1sttbq] ,gensym_1_gnhz4d3j_1sttbt.push(binary_operator(it) ) ;
return gensym_1_gnhz4d3j_1sttbt} ) .call(this) , (function( ) {for(var gensym_1_gnhz4d3j_1sttbs= (qw( '+ - ! ~' ) ) ,gensym_1_gnhz4d3j_1sttbt= [ ] ,gensym_1_gnhz4d3j_1sttbq=0,gensym_1_gnhz4d3j_1sttbr=gensym_1_gnhz4d3j_1sttbs.length,it;
gensym_1_gnhz4d3j_1sttbq<gensym_1_gnhz4d3j_1sttbr;
 ++gensym_1_gnhz4d3j_1sttbq)it=gensym_1_gnhz4d3j_1sttbs[gensym_1_gnhz4d3j_1sttbq] ,gensym_1_gnhz4d3j_1sttbt.push(unary_operator(it) ) ;
return gensym_1_gnhz4d3j_1sttbt} ) .call(this) ,rule( 'E[(_x)]' , '(E[_x])' ) ,rule( 'E[++_x]' , 'H[_, ++_x]' ) ,rule( 'E[--_x]' , 'H[_, --_x]' ) ,rule( 'E[_x++]' , 'H[_, _x++]' ) ,rule( 'E[_x--]' , 'H[_, _x--]' ) ,rule( 'E[_x, _y]' , 'E[_x], E[_y]' ) ,rule( 'E[_x._y]' , 'H[_, E[_x]._y]' ) ,rule( 'E[_o._m(_xs)]' , 'D[_, E[_o], _m, [E[_xs]]]' ) ,rule( 'E[_o[_m](_xs)]' , 'I[_, E[_o], E[_m], [E[_xs]]]' ) ,rule( 'E[typeof _x]' , 'H[_, typeof _x]' ) ,rule( 'E[void _x]' , 'H[_, void E[_x]]' ) ,rule( 'E[delete _x]' , 'H[_, delete _x]' ) ,rule( 'E[delete _x._y]' , 'H[_, delete E[_x]._y]' ) ,rule( 'E[delete _x[_y]]' , 'H[_, delete E[_x][E[_y]]]' ) ,rule( 'E[new _x(_y)]' , 'H[_, new H[_x](E[_y])]' ) ,rule( 'E[{_ps}]' , 'H[_, {E[_ps]}]' ) ,rule( 'E[_k: _v]' , '_k: E[_v]' ) ,rule( 'E[[_xs]]' , 'H[_, [E[_xs]]]' ) ,rule( 'E[_x ? _y : _z]' , 'H[_, E[_x] ? E[_y] : E[_z]]' ) ,rule( 'E[function ()    {_body}]' , 'H[_, function ()    {S[_body]}]' ) ,rule( 'E[function (_xs) {_body}]' , 'H[_, function (_xs) {S[_body]}]' ) ] ) } ) .call(this) ,statement_macros= [rule( 'S[_x]' , 'E[_x]' ) ,rule( 'S[{_x}]' , '{S[_x]}' ) ,rule( 'S[_x; _y]' , 'S[_x]; S[_y]' ) ,rule( 'S[_x _y]' , 'S[_x] S[_y]' ) ,rule( 'S[break _label]' , 'break _label' ) ,rule( 'S[for (_x) _y]' , 'for (S[_x]) S[_y]' ) ,rule( 'S[break]' , 'break' ) ,rule( 'S[for (_x; _y; _z) _body]' , 'for (S[_x]; E[_y]; E[_z]) S[_body]' ) ,rule( 'S[while (_x) _y]' , 'while (E[_x]) S[_y]' ) ,rule( 'S[_x, _y]' , 'S[_x], S[_y]' ) ,rule( 'S[do _x; while (_y)]' , 'do S[_x]; while (E[_y])' ) ,rule( 'S[_x = _y]' , '_x = E[_y]' ) ,rule( 'S[do {_x} while (_y)]' , 'do {S[_x]} while (E[_y])' ) ,rule( 'V[_x]' , '_x' ) ,rule( 'V[_x = _y]' , '_x = E[_y]' ) ,rule( 'S[try {_x} catch (_e) {_y}]' , 'try {S[_x]} catch (_e) {S[_y]}' ) ,rule( 'V[_x, _y]' , 'V[_x], V[_y]' ) ,rule( 'S[try {_x} catch (_e) {_y} finally {_z}]' , 'try {S[_x]} catch (_e) {S[_y]} finally {S[_z]}' ) ,rule( 'S[var _xs]' , 'var V[_xs]' ) ,rule( 'S[try {_x} finally {_y}]' , 'try {S[_x]} finally {S[_y]}' ) ,rule( 'S[const _xs]' , 'const V[_xs]' ) ,rule( 'S[function _f(_args) {_body}]' , 'function _f(_args) {S[_body]}' ) ,rule( 'S[return _x]' , 'return E[_x]' ) ,rule( 'S[function _f()      {_body}]' , 'function _f()      {S[_body]}' ) ,rule( 'S[return]' , 'return' ) ,rule( 'S[throw _x]' , 'throw E[_x]' ) ,rule( 'S[if (_x) _y]' , 'if (E[_x]) S[_y]' ) ,rule( 'S[if (_x) _y; else _z]' , 'if (E[_x]) S[_y]; else S[_z]' ) ,rule( 'S[continue _label]' , 'continue _label' ) ,rule( 'S[if (_x) {_y} else _z]' , 'if (E[_x]) {S[_y]} else S[_z]' ) ,rule( 'S[continue]' , 'continue' ) ,rule( 'S[switch (_c) {_body}]' , 'switch (E[_c]) {S[_body]}' ) ,rule( 'S[_label: _stuff]' , '_label: S[_stuff]' ) ,rule( 'S[with (_x) _y]' , 'with (E[_x]) S[_y]' ) ] ,hook_macros= (function( ) {var before_hook= (function(tree) {return( (before) && (before(tree) ) ) } ) ,after_hook= (function(tree,value) {return(function(it) {return(value) } ) .call(this, ( ( (after) && (after(tree,value) ) ) ) ) } ) ,after_method_hook= (function(tree,object,method,parameters) {return(function( ) {var resolved=object[method] ;
return( (function(it) {return(after_hook(tree,resolved.apply(object,parameters) ) ) } ) .call(this, ( (function(it) {return(after_hook(tree[0] ,resolved) ) } ) .call(this, (before_hook(tree[0] ) ) ) ) ) ) } ) .call(this) } ) ,before_hook_ref=new $.ref(before_hook) ,after_hook_ref=new $.ref(after_hook) ,after_method_hook_ref=new $.ref(after_method_hook) ,quote_method_name= (function(node) {return( '"' + (node.data.replace( /(")/g , "\\$1" ) ) + '"' ) } ) ,expression_hook_template=$.parse( '(_before(_tree), _after(_tree, _expression))' ) ,indirect_method_hook_template=$.parse( '(_before(_tree), _after(_tree, _object, _method, [_parameters]))' ) ,expression_hook= (function(original,tree) {return expression_hook_template.replace( {_before:before_hook_ref,_after:after_hook_ref,_tree:new $.ref(original) ,_expression:tree.as( '(' ) } ) } ) ,method_hook= (function(tree,object,method,parameters) {return indirect_method_hook_template.replace( {_before:before_hook_ref,_after:after_method_hook_ref,_tree:new $.ref(tree) ,_object:object,_method:method,_parameters:parameters} ) } ) ,direct_method_hook= (function(tree,match) {return method_hook(tree,match._object,quote_method_name(match._method) ,match._parameters) } ) ,indirect_method_hook= (function(tree,match) {return method_hook(tree,match._object,match._method,match._parameters) } ) ;
return( [rule( 'H[_tree, _x]' , (function(match) {return expression_hook(match._tree[1] ,match._x) } ) ) ,rule( 'D[_tree, _object, _method, [_parameters]]' , (function(match) {return direct_method_hook(match._tree[1] ,match) } ) ) ,rule( 'I[_tree, _object, _method, [_parameters]]' , (function(match) {return indirect_method_hook(match._tree[1] ,match) } ) ) ] ) } ) .call(this) ;
return( (function(it) {return(it.init_function= (function(tree) {return this.macroexpand(anon( 'S[_x]' ) .replace( {_x:tree} ) ) } ) ) ,it} ) .call(this, ($.clone() .macros(expression_macros,statement_macros,hook_macros) ) ) ) } ) .call(this) } ) } ) } ) .call(this) ) ) (caterwaul) ;
caterwaul.js_base() (caterwaul.precompiled_internal( (function( ) { /* unary ; node */var gensym_1_gnhz4d3j_1sttce=new caterwaul.syntax( '()' ,new caterwaul.syntax( '.' ,new caterwaul.syntax( '.' ,new caterwaul.syntax( 'caterwaul' ) ,new caterwaul.syntax( 'assertions' ) ) ,new caterwaul.syntax( '_name' ) ) ,new caterwaul.syntax( ',' ,new caterwaul.syntax( ',' ,new caterwaul.syntax( '_expression' ) ,new caterwaul.syntax( '_parameters' ) ) ,new caterwaul.syntax( '_ref' ) ) ) ;
return(function($) {$.assert= (function(condition,message) {return condition|| (function( ) {throw new Error(message) } ) .call(this) } ) ;
$.assertions= {should_be: (function(a,b,statement) {return $.assert(a===b, ( '' + (statement.toString() ) + ': ' + (a) + ' !== ' + (b) + '' ) ) } ) ,should_not_be: (function(a,b,statement) {return $.assert(a!==b, ( '' + (statement.toString() ) + ': ' + (a) + ' === ' + (b) + '' ) ) } ) } ;
$.test_case_gensym=$.gensym() ;
$.test_words= (function(language) {return(function( ) {var assertion_method= (function(name) {return language.parameterized_modifier(name, (function(match) {return gensym_1_gnhz4d3j_1sttce.replace( {_expression:match._expression,_parameters:match._parameters,_name:name,_ref:new $.ref(match._) } ) } ) ) } ) ;
return($.map(assertion_method, [ 'should_be' , 'should_not_be' ] ) ) } ) .call(this) } ) ;
$.test_base= (function() {return(function(it) {return(it.macros( (it.macros() || [ ] ) .concat(it.test_words(it.js() ) ) ) ) ,it} ) .call(this, (this.clone() ) ) } ) ;
$.test= (function(f) {return this.test_base() (f) () } ) } ) } ) .call(this) ) ) (caterwaul) ;
