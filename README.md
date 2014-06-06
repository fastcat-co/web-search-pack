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
