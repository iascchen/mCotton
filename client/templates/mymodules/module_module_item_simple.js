Template.moduleModuleItemSimple.helpers({
    _: function () {
        var my_module = MyModules.findOne({_id: this._id});
        return Modules.findOne({_id: my_module.module_id});
    },
    gray : function(){
        var my_module = MyModules.findOne({_id: this._id});

        if ((my_module.status == "used") || (my_module.status == "retired")) {
            return "gray";
        }
    },
});
