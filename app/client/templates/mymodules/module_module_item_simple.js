Template.moduleModuleItemSimple.helpers({
    _: function () {
        var my_module = MyModules.findOne({_id: this._id});
        return Collections.Modules.findOne({_id: my_module.module_id});
    },
    gray : function(){
        var my_module = MyModules.findOne({_id: this._id});

        if (my_module.status >= STATUS_DISABLE) {
            return "gray";
        }
    },
});
