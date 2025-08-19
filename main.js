var GOLD, SILVER, BRONZE;

var gTOs = 10, sTOb = 10;

$(document).ready(function(){
    init();
    
    $(".lock").on("click", function(){
        if($(this).prop("checked")){
            $("input[class^='pri-']").prop("disabled", true);
            $("input[type=button]").prop("disabled", false);
            getCurrentMoney();
        }else{
            $("input[class^='pri-']").prop("disabled", false);
            $("input[type=button]").prop("disabled", true);
        }
        updateLedger("Gold: " + GOLD + ", Silver: " + SILVER + ", Bronze: " + BRONZE);
    });
    
    $("input[type=button]").on("click", function(){
        var value = $(this).prop("value").toLowerCase();
        
        var gold_tmp, silver_tmp, bronze_tmp;

        gold_tmp = parseInt($(".sec-gold").val());
        silver_tmp = parseInt($(".sec-silver").val());
        bronze_tmp = parseInt($(".sec-bronze").val());
        BRONZE = parseInt(BRONZE);
        SILVER = parseInt(SILVER);
        GOLD = parseInt(GOLD);
        
        //console.log("gold: " + gold_tmp + ", silver: " + silver_tmp + ", bronze: " + bronze_tmp);
        
        switch(value){
            case "add":
                //console.log("add");
                if($.isNumeric(gold_tmp)){
                    GOLD = GOLD + gold_tmp;
                    if(gold_tmp > 0){
                        updateLedger("Added: " + gold_tmp + "g");
                    }
                }
                if($.isNumeric(silver_tmp)){
                    SILVER = SILVER + silver_tmp;
                    if(silver_tmp > 0){
                        updateLedger("Added: " + silver_tmp + "s");
                    }
                }
                if($.isNumeric(bronze_tmp)){
                    BRONZE = BRONZE + bronze_tmp;
                    if(bronze_tmp > 0){
                        updateLedger("Added: " + bronze_tmp + "b");
                    }
                }
                break;
            case "spend":
                //console.log("spend");
                
                var temp_gold, temp_silv, temp_brnz;
                
                if($.isNumeric(bronze_tmp)){
                    temp_gold = GOLD;
                    temp_silv = SILVER;
                    temp_brnz = BRONZE;
                    while(bronze_tmp > 0){
                        if(bronze_tmp <= temp_brnz){
                            temp_brnz = temp_brnz - bronze_tmp;
                            updateLedger("Spent: " + bronze_tmp + "b");
                            bronze_tmp = 0;
                            GOLD = temp_gold;
                            SILVER = temp_silv;
                            BRONZE = temp_brnz;
                        }else{
                            if(temp_silv > 0){
                                temp_silv = temp_silv - 1;
                                temp_brnz = temp_brnz + sTOb;
                                //console.log("convert silver");
                            }else{
                                if(temp_gold > 0){
                                    temp_gold = temp_gold - 1;
                                    temp_silv = temp_silv + (gTOs - 1);
                                    temp_brnz = temp_brnz + sTOb;
                                    //console.log("convert gold");
                                }else{
                                    bronze_tmp = 0;
                                    updateLedger("Not enough(b) for purchase");
                                }
                            }
                        }
                    }
                }
                
                if($.isNumeric(silver_tmp)){
                    temp_gold = GOLD;
                    temp_silv = SILVER;
                    while(silver_tmp > 0){
                        if(silver_tmp <= temp_silv){
                            temp_silv = temp_silv - silver_tmp;
                            updateLedger("Spent: " + silver_tmp + "s");
                            silver_tmp = 0;
                            GOLD = temp_gold;
                            SILVER = temp_silv;
                        }else{
                            if(temp_gold > 0){
                                temp_gold = temp_gold - 1;
                                temp_silv = temp_silv + gTOs;
                                //console.log("convert gold");
                            }else{
                                silver_tmp = 0;
                                updateLedger("Not enough(s) for purchase");
                            }
                        }
                    }
                }
                
                if($.isNumeric(gold_tmp)){
                    temp_gold = GOLD;
                    if(gold_tmp <= temp_gold){
                        temp_gold = temp_gold - gold_tmp;
                        updateLedger("Spent: " + gold_tmp + "g");
                        gold_tmp = 0;
                        GOLD = temp_gold;
                    }else{
                        updateLedger("Not enough(g) for purchase");
                    }
                }
                break;
            default:
                console.log("default");
                break;
        }
        
        setCurrentMoney();
        setCookies();
        $("input[class^='sec-']").val("");
        
    });
    
});

$(window).on("unload", function(){
    setCookies();
});

function init(){
    if(checkCookies()){
        getCookies();
        setCurrentMoney();
        $("input[class^='pri-']").prop("disabled", true);
        $(".lock").prop("checked", true);
    }else{
        $("input[type=button]").prop("disabled", true);
    }
    
    var rand = Math.floor(Math.random() * Math.floor(2));
    var img;
    switch(rand){
        case 0:
            img = "dance.gif";
            break;
        case 1:
            img = "money-bag.gif";
            break;
        case 2:
            break;
        default:
            break;
    }
    $("#dance").children($("img")).attr("src", "img/" + img);
}

function getCurrentMoney(){
    GOLD = $(".pri-gold").val();
    if(GOLD == ""){
        GOLD = 0;
        $(".pri-gold").val(GOLD);
    }
    SILVER = $(".pri-silver").val();
    if(SILVER == ""){
        SILVER = 0;
        $(".pri-silver").val(SILVER);
    }
    BRONZE = $(".pri-bronze").val();
    if(BRONZE == ""){
        BRONZE = 0;
        $(".pri-bronze").val(BRONZE);
    }
}

function setCurrentMoney(){
    $(".pri-gold").val(GOLD);
    $(".pri-silver").val(SILVER);
    $(".pri-bronze").val(BRONZE);
}

function updateLedger(log){
    var msg = log;
    $(".log").append(msg + "\r\n");
    $(".log").scrollTop($(".log")[0].scrollHeight);
}

function setCookies(){
    if(!((GOLD == 0 || GOLD == "") && (SILVER == 0 || SILVER == "") && (BRONZE == 0 || BRONZE == ""))){
        Cookies.set("gold", GOLD, { expires: 14 });
        Cookies.set("silver", SILVER, { expires: 14 });
        Cookies.set("bronze", BRONZE, { expires: 14 });
    }else{
        removeCookies();
    }
}

function getCookies(){
    GOLD = Cookies.get("gold");
    SILVER = Cookies.get("silver");
    BRONZE = Cookies.get("bronze");
}

function checkCookies(){
    if(Cookies.get("gold") >= 0){
        return true;
    }else{
        return false;
    }
}

function removeCookies(){
    Cookies.remove("gold");
    Cookies.remove("silver");
    Cookies.remove("bronze");
}