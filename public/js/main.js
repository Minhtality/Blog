$(document).ready(function() {
    $('.delete-blog').on('click', function(e) {
        $target = $(e.target);
        const id = ($target.attr('data-id'));
        $.ajax({
        	type:'DELETE',
        	url:'/allBlogs/' + id,
        	success: function(response){
        		alert("Deleted blog");
        		window.location.href='/allBlogs'
        	},
        	error: function(err){
        		console.log(err);
        	}
        });
    });

    $('.alert').on('click', function(e){
        $(".alert").alert('close');
    });

});

