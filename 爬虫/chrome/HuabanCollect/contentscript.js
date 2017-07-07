+function($,window){

    $(function(){

        var btn = $('<a href="javascript:void(0);" class="btn rbtn"><span class="text">转存到我的花瓣</span></a>').prependTo(".action-buttons");

        var boards = {};
        $.ajax({
            url: 'http://huaban.com/last_boards/?ia4pre19&extra=recommend_tags',
            async: false,
            dataType: 'json',
            success: function(res){
                boards = res.boards;
            }
        });

        var dialog =
            '<div id="collect_all_dialog" data-name="repin" class="dialog-box">' +
            '<div class="box-title">转采</div>' +
            '<div class="box-inner">' +
            '<div class="pin-create">' +
            '<div >' +
            '<select id="myBoard" class="my_boards">';
        for (var i in boards) {
            dialog += "<option value='"+boards[i]['board_id']+"'>"+ boards[i]['title'] +"</option>";
        }
        dialog += '</select>' +
        '</div>' +
        '<div class="bottom-part">' +
        '<div class="buttons"><a id="collect-all" href="javascript:void(0);" class="gogogo btn btn18 rbtn"><span class="text"> 采下来</span></a></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="close-btn"><i></i></div>' +
        '</div>';

        $dialog = $(dialog);

        $dialog.find(".close-btn").click(function () {
            $(".dialog-boxes").children(".dialog-overlay").remove();
            $("#collect_all_dialog").remove();
        });

        $dialog.find(".gogogo").click(function () {
            $.ajax({
                url: "http://huaban.com" + window.location.pathname,
                data: {
                    limit:10000000
                },
                dataType: 'json',
                type: 'get',
                success: function (res) {
                    var pins = res.board.pins;
                    var myBoard = $("#myBoard").val();
                    for (var i in pins) {
                        $.ajax({
                            type:"post",
                            url: 'http://huaban.com/pins/',
                            data:{
                                board_id: myBoard,
                                text: pins[i]['raw_text'],
                                via: pins[i]['pin_id'],
                                share_button: 0
                            },
                            dataType: 'json',
                            async: false,
                            success: function (res) {
                                console.log(i + "[成功]");
                            }
                        });
                    }
                }
            });

        });

        btn.click(function(){
            $("#dm_box .dialog-overlay").clone(true).appendTo(".dialog-boxes");
            $dialog.appendTo(".dialog-boxes");
        });
    });


}(jQuery, window);