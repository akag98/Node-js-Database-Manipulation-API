(function ($) {
    
    "use strict";
        
    $(".toggle-password").mouseover(function() {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        input.attr("type", "text");
    });

    $(".toggle-password").mouseout(function() {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        input.attr("type", "password");        
    });
    
    $('#auto1, #auto2, #auto3').typeahead({
        source: function(query, result){
            $.ajax({
                url:"/autoComplete",
                method:"GET",
                data:{query:query},
                dataType:"json",
                success:function(data){
                    result($.map(data, function(item){
                        return item;
                    }));
                }
            })
        }
    }); 
    
    $('.contact_submit').click(function(event){
        var email = $("#auto3").val();
        var choice = confirm("Do you really want to delete '" + email + "'?");
        if(choice == false){
            event.preventDefault();
        }
    })

    
})(jQuery);

