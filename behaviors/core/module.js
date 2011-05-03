// Caterwaul object system.
// Caterwaul often uses classes, but Javascript doesn't specify much in the way of object-oriented development. (No complaints from me about this by the way.) This behavior is an attempt to
// provide a standard basis for caterwaul's internal and external modules.

//   Two roles for classes.
//   The goal of caterwaul classes is to provide a useful abstraction for building constructor functions. But in addition to setting up the prototype and managing the existence of constructors,
//   classes are also able to extend existing objects without owning their prototypes.

//   Prototypes are flattened automatically. This divorces the object model from Javascript's single-inheritance prototype chain and reduces method lookup times. (Also, it doesn't impose much of
//   a performance overhead provided that class updates are relatively rare.) Note that a single instance doesn't generally inherit from multiple classes, but a class might have several parents.
//   For instance, if A < B and A < C, then you can still create a prototype instance of A. A.parents() will return [B, C].

//   Storing instance data.
//   I really like the way Ruby handles instance data; that is, it's private to the instance and methods are always used to access it. This library behaves similarly; by convention all instance
//   state is stored in an attribute called instance_data, which is a hash.

//   Behaviors.
//   Earlier I mentioned that classes have two roles. One is as a standard Javascript constructor, the other is as an add-on for an object. After spending too long trying to figure out what the
//   implementation should look like (along with obligatory confusing metacircularity), I've come up with the following mechanism:

//   | 1. The central thing that I'm calling a 'module' is in fact a behavior. It knows how to add itself to other objects.
//     2. Each module/behavior has a method that returns a constructor for that module/behavior. The constructor is a snapshot of its immediate state and isn't updated automatically if you add
//        new methods.

//   If you're familiar with my questionably-named github.com/spencertipping/js-typeclasses project, behaviors correspond to typeclasses. They're called 'modules' here to appeal to Ruby parlance,
//   even though they're actually a bit different.

    var calls_init = function () {var f = function () {return f.init.apply(f, arguments)}; return f},
        module     = calls_init();

//   Module bootstrapping.
//   We need to get the module to a point where its methods can be added to things. At that point we can use it to add its own methods to itself, thus forming the circular relationship required
//   to appropriately confuse users who seek to find the bottom turtle in our object-oriented metahierarchy.

    se(module.instance_data = {}, function () {

//     Object extension.
//     The primary purpose of a module is to extend an object. To this end, a module specifies one or more named extenders, each of which is run on the object to be extended. These are
//     responsible for handling different types of initializations that the module might want to perform. (Providing methods for the object is only one of many possibilities.)

//     Note that extending an object overrides any methods that are already defined and doesn't back up the original values. If you don't want this behavior then you'll need to write a new method
//     similar to extend_methods and replace extend() to call that one instead.

      se(this.methods = {}, function () {this.extend_methods       = function (o) {var ms = this.methods(); for (var k in ms) if (ms.hasOwnProperty(k)) o[k] = ms[k]; return o};
                                         this.extend_instance_data = function (o) {o.instance_data || (o.instance_data = {}); return o};

                                         this.methods       =               function ()  {return this.instance_data.methods};
                                         this.extend_single = this.extend = function (o) {return this.extend_methods(o), this.extend_instance_data(o), o}})});

//     At this point our module is sufficiently functional to extend itself:

    module.extend_methods       = module.instance_data.methods.extend_methods;
    module.extend_instance_data = module.instance_data.methods.extend_instance_data;
    module.methods              = module.instance_data.methods.methods;

    module.instance_data.methods.extend.call(module, module);

//   Module methods.
//   These are instance methods on 'module' (which will be an instance of itself) and any modules you get by instantiating it. They're used to define class methods, instance methods, and compile
//   a constructor function from the module. There are also functions to perform inheritance and mixing in.

//     Class evaluation.
//     Also swiped from Ruby is the class_eval method, which you'll probably use much more often. For example:

//     | my_module.class_eval(function (def) {
//         def('foo', function () {
//           return 'bar';
//         });
//       });
//       new (my_module.compile())().foo()         // -> 'bar'

//     Class_eval has a corresponding 'def' behavior module. This allows you to create methods on the 'def' function.

      se(module.methods(), function () {this.create_class_eval_def = function ()  {var t = this; return this.class_eval_def().extend(function () {return t.method.apply(t, arguments)})};
                                        this.class_eval_def        = function ()  {return this.instance_data.class_eval_def || module.default_class_eval_def};
                                        this.class_eval            = function (f) {return f.call(this, this.create_class_eval_def()) || this}});

//     Self evaluation.
//     This lets you use module-level metaprogramming against a single instance. The idea is to create an anonymous module, class_eval() it with the given function, and then extend the current
//     module with the anonymous one. Note that this operates on the instance_eval level, not the class_eval level; instances of your module will be unaffected by self_evaling things.

      se(module.methods(), function () {this.self_eval = function (f) {return module.extend({}).class_eval(f).extend(this)}});

//     Method creation.
//     The most common thing we'll want to do with a module is add methods to it. The lowest-level way to do this is to use the .method() method, which lets you define a method under one or more
//     names. (It also is used by the class_eval def() function.)

      se(module.methods(), function () {this.method = function () {for (var ms = this.methods(), i = 0, l = arguments.length - 1, f = arguments[l]; i < l; ++i) ms[arguments[i]] = f;
                                                                   return this}});

//     Circularity.
//     At this point our module basically works, so we can add it to itself again to get the functionality built above.

      module.extend(module);
      module.default_class_eval_def = module.extend({});

//   Common design patterns.
//   From here we add methods to make 'module' easier to use.

    module.class_eval(function (def) {
      def('attr', 'attrs', function ()     {for (var i = 0, l = arguments.length; i < l; ++i) this.method(arguments[i], this.accessor_for(arguments[i])); return this});
      def('accessor_for',  function (name) {return function (x) {if (arguments.length) return this.instance_data[name] = x, this;
                                                                 else                  return this.instance_data[name]}});

      def('attr_null',              function (name, f) {return this.method(name, function () {return name in this.instance_data ? this.instance_data[name] : f.apply(this, arguments)})});
      def('attr_once', 'attr_lazy', function (name, f) {return this.method(name, function () {return name in this.instance_data ? this.instance_data[name] :
                                                                                                                                  (this.instance_data[name] = f.apply(this, arguments))})})});

    module.extend(module).attr_lazy('methods', Object).attr_null('class_eval_def', function () {return module.default_class_eval_def}).extend(module);

//   Instantiation.
//   Modules can provide an instance constructor called 'create_instance'. This will be called automatically when you invoke the 'create' method, and the object returned by 'create_instance' is
//   extended and used as the instance. So, for example:

//   | my_module.self_eval(function (def) {
//       def('create_instance', function () {return function () {return 10}});
//       def('foo', function () {return 'bar'});
//     });
//     my_module.create()          // -> [function]
//     my_module.create()()        // -> 10
//     my_module.create().foo()    // -> 'bar'

//   Arguments passed into 'create' are forwarded both to 'create_instance' and the resulting instance's 'initialize' method.

    module.class_eval(function (def) {def('create', 'init', function () {var instance = this.extend(this.create_instance && this.create_instance.apply(this, arguments) || {});
                                                                         return instance.initialize && instance.initialize.apply(instance, arguments), instance})}).

            self_eval(function (def) {def('create_instance', calls_init)});

//   Inheritance.
//   Each module has a list of parents that it uses during extension. Because a module might inherit from itself the implementation knows how to avoid infinite-looping from cyclical inheritance
//   structures. This is done by using the 'identity' method.

    module.attr_lazy('identity', gensym).attr_lazy('parents', Array).class_eval(function (def) {
      def('include', function () {var ps = this.parents(); ps.push.apply(ps, arguments); return this});
      def('extend_parents', function (o, seen) {
        for (var s = seen || {}, ps = this.parents(), i = 0, l = ps.length, p, id; i < l; ++i) s[id = (p = ps[i]).identity()] || (s[id] = true, p.extend_parents(o, s)), p.extend_single(o);
        return o})});

//   New extend method.
//   This is the finished implementation of extend(). It knows about methods, inheritance, and instance data.

    module.class_eval(function (def) {def('extend', function (o) {return this.extend_parents(o), this.extend_single(o), o})});

//   Constructor creation.
//   Most of the time in OOP we'll be working with actual constructors rather than this behavior stuff, if for no other reason than the fact that Javascript's prototype inheritance is much
//   faster. To quickly convert a module to a constructor function, you can use the 'compile' method. This will take a snapshot of the module state and give you a constructor to generate those
//   objects. The constructor forwards to initialize() just like it normally would.

    module.class_eval(function (def) {def('compile', function () {var f = function () {this.instance_data = {}; this.initialize && this.initialize.apply(this, arguments)};
                                                                  this.extend(f.prototype); delete f.prototype.instance_data;
                                                                  return f})});

//   Constructing the final 'module' object.
//   Now all we have to do is extend 'module' with itself and make sure its constructor ends up being invoked. Because its instance data doesn't have the full list of extension stages, we have to
//   explicitly invoke its constructor on itself for this to work.

    module.extend(module).extend(module.default_class_eval_def);
// Generated by SDoc 