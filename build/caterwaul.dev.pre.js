caterwaul.words(caterwaul.js() ) (function($) {$.precompile(f) =this.compile(remove_gensyms(traced.references,perform_substitution(traced.references,traced.annotated) ) ) -where[traced=trace_execution(this,f) ] -where[nontrivial_function_pattern=$.parse( 'function (_args) {_body}' ) ,trivial_function_pattern=$.parse( 'function ()      {_body}' ) ,nontrivial_function_gensym_template=$.parse( 'function (_args, _gensym) {_body}' ) ,trivial_function_gensym_template=$.parse( 'function (_gensym)        {_body}' ) ,nontrivial_gensym_detection_pattern=nontrivial_function_gensym_template,trivial_gensym_detection_pattern=trivial_function_gensym_template,annotate_macro_generator(template) (references) (match) =result-se[references[s] = {tree:result} ] -where[s=$.gensym( 'mark' ) ,result=template.replace( {_args:match._args,_gensym:s,_body:annotate_functions_in(match._body,references) } ) ] ,mark_nontrivial_function_macro=annotate_macro_generator(nontrivial_function_gensym_template) ,mark_trivial_function_macro=annotate_macro_generator(trivial_function_gensym_template) ,annotate_functions_in(tree,references) =$.macroexpand(tree,$.replacer(trivial_function_pattern,mark_trivial_function_macro(references) ) ,$.replacer(nontrivial_function_pattern,mark_nontrivial_function_macro(references) ) ) ,function_key(tree) =matches._gensym.data-when.matches-where[matches=nontrivial_gensym_detection_pattern.match(tree) ||trivial_gensym_detection_pattern.match(tree) ] ,mark_as_compiled(references,k,tree,environment) =references[k] -se-raise[new Error( 'detected multiple compilations of #{references[k].tree}' ) ] /when[references[k] .compiled] -se[references[k] .compiled=tree,references[k] .environment=environment] -when[k&&references[k] ] ,wrapped_compile(original,references) (tree,environment,options) =original.call(this,tree,environment,options) -se-mark_as_compiled(references,function_key(tree) ,tree,$.merge( { } ,this._environment|| { } ,environment) ) ,signal_already_compiled(tree) =qs[caterwaul.precompiled_internal(_x) ] .replace( {_x:tree} ) ,closure_template=$.parse( '(function () {_vars; return (_value)}).call(this)' ) ,closure_variable_template=$.parse( 'var _var = _value' ) ,closure_null_template=$.parse( 'null' ) ,escape_string(s) = '\'' +s.replace( /\\/g , '\\\\' ) .replace( /\n/g , '\\n' ) .replace( /'/g , '\\\'' ) + '\'' ,serialize_syntax(value) =value.length===0?qs[new caterwaul.syntax(_name) ] .replace( {_name:escape_string(value.data) } ) :qs[new caterwaul.syntax(_name,_children) ] .replace( {_name:escape_string(value.data) ,_children:children} ) -where[children=new $.syntax( ',' ,serialize_syntax(it) -over.value) .unflatten() ] ,serialize_ref(value,name,seen) = !value? '' +value:value.constructor===$.syntax?seen[value.id() ] || (seen[value.id() ] =name) -re-serialize_syntax(value) :raise[new Error( 'syntax ref value is not serializable: #{value}' ) ] ,single_variable(name,value) =closure_variable_template.replace( {_var:name,_value:value} ) ,names_and_values_for(environment) =single_variable(it,environment[it] ) -over_keys.environment,tree_variables(tree) =vars-se-tree.reach(given.n in vars.push(single_variable(n.data,serialize_ref(n.value,n.data,seen) ) ) -when[n&&n.binds_a_value] ) -where[vars= [ ] ,seen= { } ] ,variables_for(tree,environment) =where[all_variables=names_and_values_for(environment) .concat(tree_variables(tree) ) ] [all_variables.length?new $.syntax( ';' ,all_variables) :closure_null_template] ,precompiled_closure(tree,environment) =closure_template.replace( {_vars:variables_for(tree,environment) ,_value:tree} ) ,precompiled_function(tree,environment) =signal_already_compiled(precompiled_closure(tree,environment) ) ,substitute_precompiled(references) (match) =precompiled_function(ref.compiled,ref.environment) -when[ref&&ref.compiled] -where[ref=references[match._gensym.data] ] ,perform_substitution(references,tree) =$.macroexpand(tree,$.replacer( [trivial_gensym_detection_pattern,nontrivial_gensym_detection_pattern] ,substitute_precompiled(references) ) ) ,reconstruct_original(references,match) =where[new_match= {_body:remove_gensyms(references,match._body) ,_args:match._args} ] [match._args?nontrivial_function_pattern.replace(new_match) :trivial_function_pattern.replace(new_match) ] ,remove_referenced_gensyms(references) (match) =reconstruct_original(references,match) -when[ref&&ref.tree] -where[ref=references[match._gensym.data] ] ,remove_gensyms(references,tree) =$.macroexpand(tree,$.replacer( [trivial_gensym_detection_pattern,nontrivial_gensym_detection_pattern] ,remove_referenced_gensyms(references) ) ) ,annotated_caterwaul(caterwaul,references) =caterwaul.clone() -se[it.compile=wrapped_compile(it.compile,references) ] ,trace_execution(caterwaul,f) = {references:references,annotated:annotated} -se-caterwaul.compile(annotated, {caterwaul:annotated_caterwaul(caterwaul,references) } , {gensym_renaming:false} ) () -where[references= { } ,annotated=annotate_functions_in($.parse(f) ,references) ] ] } ) (caterwaul) ;
