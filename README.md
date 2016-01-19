자동완성 라이브러리
===============

##설명

검색창 하단에 자동완성결과를 보여주고, 그 오른쪽에 검색결과를 보여주는 검색라이브러리.

사용법은 다음과 같다.

```
$("#searchInput").keywordSuggest({
	toggleButtonOffsetX: 340,
	toggleButtonOffsetY: 8,
	toggleButtonOpenImg: 'btn_atcmp_up_on.gif',
	toggleButtonCloseImg: 'btn_atcmp_down_on.gif',
	dropdownOffsetX : -1,
	dropdownOffsetY : 7,
	enterPressed : enterPressedHandler,
	typingSearch: typingSearchHandler,
	keywordClicked: keywordClickHandler,
	keywordSelected: keywordSelectHandler
});
```

##설정법

`$("#searchInput").keywordSuggest();`

QuickSearch를 사용하기위한 초기셋팅이다.

input text 에 `keywordSuggest()`을 호출하여 생성한다.

css는 `keywordSuggest.css`이며, js는 `keywordSuggest.js`가 제공된다.

파라미터를 전달하여 세부설정을 할수 있으며 파라미터는 아래와 같다.



##파라미터정의

- toggleButtonOffsetX, toggleButtonOffsetY

 입력창 우측안쪽의 화살표(토글이미지)의 위치. 입력창의 left,top 을 기준으로 offset을 더해서 위치시킨다.

- toggleButtonOpenImg, toggleButtonCloseImg

 토글화살표의 열고 닫힐때의 이미지 경로.

- dropdownOffsetX, dropdownOffsetY

 자동완성창의 열리는 위치. 입력창의 left,bottm 을 기준으로 offset을 더해서 위치시킨다.

- enterPressed

 정의 : function enterPressedHandler(value)
 
 설명 : 입력창에서 키워드입력후 엔터를 눌렀을때 호출된다. value 파라미터로는 입력키워드가 전달된다.

- typingSearch

 정의 : function typingSearchHandler(value, callback)
 
 설명 : 입력창에서 키워드입력시 키가 눌릴때마다 호출된다. value 파라미터로는 입력키워드가 전달되며, 이 함수는 리턴값으로 정해진 포맷의 결과를 리턴해야 한다. 요소중 items 배열은 필수이다.

 간단예제 :
 
 ```
function typingSearchHandler(value, callback){
	callback({
		"items" : ["중국환율","중국환율계산기","중국환전중국환전싸게하는법중국환전싸게하는법"]
	});
}
 ```

 AJAX예제 :

 keyword파라미터로 검색어 전달시 json형식으로 list에 자동완성키워드를 반환하는 auto_completion.do 페이지를 준비해두었을 경우.
 
 ```
function typingSearchHandler(value, callback){
	value = $.trim(value);
	$.ajax({
		type:"get"
		,url:"auto_completion.do"
		,data:{ keyword:encodeURI(value), sn:1, ln:10 } //자동완성페이지에 value로 검색결과 10개를 요청한다.
		,dataType:"json"
		,success:function(data) {
			callback({"items":data["list"]}); //json 결과의 list항목을 사용한다.
		}
		,fail:function(data) {
		}
	});
}
 ```

- keywordClicked

 정의 : function keywordClickHandler(obj)

 설명 : 자동완성창의 키워드를 마우스클릭시 호출된다. 전달 파라미터는 클릭한 단어이다.

- keywordSelected

 정의 : function keywordSelectHandler(obj)

 설명 : 자동완성창의 키워드를 키보드 상하버튼으로 이동시 호출된다. 전달 파라미터는 키보드로 선택한 단어이다.


문자열 일치도 측정
===============

##설명

입력한 문자열을 다른 문자열과 어느 정도 일치하는지 비교하여 점수를 출력하는 라이브러리이다.

점수는 0~1점 사이이다.

사용법은 다음과 같다.

    var keyword = "";
    var sortable = [];

    function sort_score(a,b) {
        b.score = b.name.score(keyword);
        a.score = a.name.score(keyword);
        return b.score - a.score;
    }

    function print_sort(arr) {
        var list = $("ol");
        list.html("");
        $.each(sortable, function(i,v) {
            list.append("<li>" + v.name + ", " + v.score +"</li>" );
        });
    }

    function arrayfy(selector, arr) {
        $(selector).children().each(function(){
            arr.push({name: $(this).html(), score: 0});
        });
    }

    $(function(){

        arrayfy("ol", sortable);
        print_sort(sortable);
        $("#keyword").keyup(function(){
            keyword = $(this).val();
            sortable.sort(sort_score);
            print_sort(sortable);
        });
    });


##함수 설명

 - function sort_score(a, b)

 설명 : 두 문자열의 점수 차이를 비교하여 a와 b 문자열의 일치도 수치 차이를 리턴하는 함수.

 - function print_sort(arr)

 설명 : 문자열 리스트 배열을 받아 다시 출력하는 함수

 - function arrayfy(selector, arr)

 설명 : 문자열 배열을 복사


##사용방법

    arrayfy("ol", sortable);

arrayfy는 가장 먼저 사용되어야 하며, 비교될 문자열 리스트 원본이 존재하는 부분이 첫 번째 파라미터에 첨가되어야 한다.

	list.append("<li>" + v.name + ", " + v.score +"</li>" );

문자열 비교 및 일치도 점수 측정 후 호출 시에는 print_sort 함수에서 위 부분에서 태그를 입력하므로 html 태그 변경은 해당 부분을 수정하여야 한다.