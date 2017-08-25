/* ========================================================================
 * FastcatGroup: KeywordSuggest.js v1.0.0
 * http://
 * ========================================================================
 * Copyright 2013 FastcatGroup, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

+function($) {
	"use strict";

	
	var KEYWORD_SUGGEST_OPEN_CLASS = "keywordSuggest-open";
	var KEYWORD_SUGGEST_CLOSE_CLASS = "keywordSuggest-close";
	var KEYWORD_SUGGEST_COOKIE_NAME = "keywordSuggestEnabled";
	var KEYWORD_SUGGEST_DISABLED = "disabled";
	var KEYWORD_SUGGEST_SELECTED_CLASS = "keywordSuggestSelected";
	
	// KeywordSuggest PUBLIC CLASS DEFINITION
	// ===============================
	var KeyCode = {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	};
	
	var KeywordSuggest = function(element, options) {
		this.options = options;
		this.$element = $(element);
		this.$target = $($(element).attr('data-target')).find(".keywordSuggest-dropdown");
		this.$comment = $($(element).attr('data-target')).find(".keywordSuggest-comment");
		this.$dataToggle= $($(element).attr('data-target')).find('[data-toggle="keywordSuggest"]');
		
		this.$itemIndex = 0;
		
		var that = this;
		//element와 dropdown을 이벤트 function내에서 사용하기 위한 전역변수선언.
		var prevKeyword = "";
		
		this.$userKeyword = "";//사용자가 처음에 입력한 키워드.
		
		this.$enabled = (getCookie(KEYWORD_SUGGEST_COOKIE_NAME) != KEYWORD_SUGGEST_DISABLED);//자동완성 기능 사용중.
		//console.log("자동완성동작 enable>", this.$enabled);
		
		this.$target.css({'display':'none', 'position':'absolute'});
		this.$comment.css({'display':'none', 'position':'absolute'});
		
		this.$dataToggle.addClass(KEYWORD_SUGGEST_CLOSE_CLASS);
		//토글버튼 위치조정.
		var pos = this.$element.position();
		this.$dataToggle.css({'position':'absolute', 'top': pos.top + this.options.toggleButtonOffsetY , 'left': pos.left + this.options.toggleButtonOffsetX});
		this.$dataToggle.show();
		
		var typingListObj = $(that.$target.find(".keywordSuggest-keywords .keywordSuggest-list"));
		
		//엔터눌렀을때 검색하는 함수
		var enterPressedFunction = this.options.enterPressed;
		//타이핑시 자동완성 검색하는 함수.
		var typingSearchFunction = this.options.typingSearch;
		//자동완성 단어를 선택시 검색하는 함수. //KeywordSuggest를 보여주거나 submit하거나 selectSearch구현방법에 따라 선택할수 있다.
		var keywordSelected = this.options.keywordSelected;
		
		var keywordClicked = this.options.keywordClicked;
		
		function setDisable(){
			//console.log("disabled!! ");
			that.disable();
			that.hide();
			that.$enabled = false;
		}
		//data-off를 클릭시 레이어를 감추고 기능을 정지한다.
		this.$target.on('click', '[data-off="keywordSuggest"]', setDisable);
		this.$comment.on('click', '[data-off="keywordSuggest"]', setDisable);
		
		//입력박스를 클릭시 자동완성을 toggle한다.
		this.$element.on("click", function(e){
			if(that.$enabled){
				that.toggle();
			}
			e.stopPropagation();
		});
		
		//토글버튼 클릭시 자동완성을 toggle한다.
		this.$dataToggle.on("click", function(e){
			if(!(that.$enabled)){
				that.enable();
				//검색이 안되어있으므로, 검색한다.
				if($.trim(that.$element.val()) != ""){
					//callback을 받는다.
					typingSearchFunction(that.$element.val(), drawTypingListCallback);
					prevKeyword = that.$element.val();
				}
				that.show(true);
			}else{
				that.toggle(true);
			}
			
			e.stopPropagation();
		});

		//입력박스에 키 입력시 처리한다.
		this.$element.on("keydown", function(e){
			//console.log("e.keyCode", e.keyCode, "input=", that.$element.val());
			if(! that.$enabled){
				return;
			}
			//keydown시 입력창의 내용을 바로 가져올수 없으므로, 50ms 이후에 수행한다.
			setTimeout(function() {
		
			if($.trim(that.$element.val()) == ""){
				//빈문자열이면 감추고 clear하고 리턴.
				that.hide();
				that.clearTypingList();
				prevKeyword = that.$element.val();
			}
			
			if ((e.keyCode==KeyCode.UP || e.keyCode == KeyCode.DOWN || e.keyCode == KeyCode.ESCAPE || e.keyCode == KeyCode.ENTER)) {
				//enter 입력시 enterPressedFunction을 호출한다.
				if (e.keyCode == KeyCode.ENTER) {
					enterPressedFunction(that.$element.val());
					return;
				}
				
			    if (e.keyCode == KeyCode.UP){
			    	if(that.isOpened()){
			    		if(that.$itemIndex <= 1){
				    		//닫는다.
				    		that.hide();
				    		if(that.$userKeyword != ""){
				    			that.$element.val(that.$userKeyword);
				    		}
				    		//console.log("that.$userKeyword=", that.$userKeyword);
				    	}else{
				    		//선택이동 위로.
				    		that.$itemIndex--;
				    	}
				    	//hide에도 호출필요.지우기.
				    	that.updateSelection();
			    	}
			    }
			    
			    if (e.keyCode == KeyCode.DOWN){
			    	if(that.isOpened()){
				    	//if(that.$itemIndex > 0){
			    		if(that.$itemIndex == 0){
			    			that.$userKeyword = that.$element.val();
			    			//console.log("that.$element.val()=", that.$element.val(), that.$userKeyword);
			    		}
			    		
			    		//선택이동 아래로. 바운더리체크.
			    		if(that.$itemIndex < typingListObj.children().length){
			    			that.$itemIndex++;
			    		}
			    		
			    	}else{
			    		//연다.
			    		that.showIfAvaliable();
			    	}
			    	that.updateSelection();
			    }
				
			    
			    if (e.keyCode == KeyCode.ESCAPE){
			    	//닫는다.
		    		that.hide();
			    }
			} else{
				//키워드가 변했을때만 typing 검색을 한다.
				if(that.$element.val() != prevKeyword){
					
					//callback을 받는다.
					typingSearchFunction(that.$element.val(), drawTypingListCallback);
					
					prevKeyword = that.$element.val();
				}
			}
		  
			}, 50);                                   
		});
		
		$("body").on("click", function(e){
			that.hide();
		});
		
		that.$target.on("click", function(e){
			e.stopPropagation();
		});
		
		function drawTypingListCallback(data){
			//console.log("callback data > ", data, data.item);
			if(data && data.items && data.items.length > 0){
				//보여준다.
				that.drawTypingList(data.items);
				that.show();
			}else{
				//console.log("감추기.");
				that.hide();
				that.clearTypingList();
			}
		}
		
		this.updateSelection = function(){
			//console.log("typingListObj.length>", typingListObj.children().length);
			typingListObj.children().removeClass(KEYWORD_SUGGEST_SELECTED_CLASS);
			if(that.$itemIndex > 0){
				var $selectedItem = typingListObj.children(":nth-child("+that.$itemIndex+")");
				$selectedItem.addClass(KEYWORD_SUGGEST_SELECTED_CLASS);
				//console.log("select ", that.$itemIndex, $selectedItem.text());
				that.$element.val($selectedItem.text());
				
				keywordSelected($selectedItem.text());
			}
			
		};
		
		this.getTypingListLength = function(){
			return typingListObj.children().length;
		};
		this.clearTypingList = function(){
			typingListObj.empty();
		};
		
		this.drawTypingList = function(list){
			typingListObj.empty();
			for ( var i = 0; i < list.length; i++) {
				typingListObj.append("<li><a>" + list[i] + "</a></li>");
			}
			
			typingListObj.children().on("mouseover", function(){
				//마우스오버한 아이템은 하이라이팅해준다.
				$(this).addClass(KEYWORD_SUGGEST_SELECTED_CLASS);
				typingListObj.children(":nth-child("+that.$itemIndex+")").addClass(KEYWORD_SUGGEST_SELECTED_CLASS);
			});
			typingListObj.children().on("mouseout", function(){
				$(this).removeClass(KEYWORD_SUGGEST_SELECTED_CLASS);
				typingListObj.children(":nth-child("+that.$itemIndex+")").addClass(KEYWORD_SUGGEST_SELECTED_CLASS);
			});
			typingListObj.children().on("click", function(){
				that.$itemIndex = $(this).index() + 1; //index()는 0부터 시작하므로 1을 더해준다.
				//선택을 제외하고 하이라이팅지우기.
				typingListObj.children(":not(:nth-child("+that.$itemIndex+"))").removeClass(KEYWORD_SUGGEST_SELECTED_CLASS);
				
				//키보드로 선택을 안한상태에서 바로 마우스 클릭시 타이핑한 검색어가 저장이 안되어있으므로 저장한다. 
				if(that.$userKeyword == ""){
					that.$userKeyword = that.$element.val();
				}
				that.$element.val($(this).text());
				//click후 검색박스가 focus를 잃으면 key up/down이 안되므로 focus를 준다. 
				that.$element.focus();
				
				keywordClicked($(this).text());
			});
		};
		
		return this;
	};

	
	KeywordSuggest.prototype.isOpened = function() {
		return this.$dataToggle.hasClass(KEYWORD_SUGGEST_OPEN_CLASS);
	};
	
	KeywordSuggest.prototype.isClosed = function() {
		return this.$dataToggle.hasClass(KEYWORD_SUGGEST_CLOSE_CLASS);
	};
	
	KeywordSuggest.prototype.showIfAvaliable = function(showCommentIfNoResult) {
		if(this.$enabled){
			this.show(showCommentIfNoResult);
		}
	};
	
	KeywordSuggest.prototype.show = function(showCommentIfNoResult) {
		//console.log("showCommentIfNoResult", showCommentIfNoResult);
		var startEvent = $.Event('show.fg.keywordSuggest');
		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented())
			return;
			
		if(! this.$enabled){
			//console.log("cannot because disabled! ");
			return;
		}
		
		var pos = this.$element.position();
		
		if(this.getTypingListLength() > 0){
			this.$comment.hide(); //사용중입니다 메시지를 감추고 보여준다.
			
			this.$target.css({'top': pos.top + this.options.dropdownOffsetY + this.$element.outerHeight(true), 'left': pos.left + this.options.dropdownOffsetX});
			this.$dataToggle.css({'top': pos.top + this.options.toggleButtonOffsetY , 'left': pos.left + this.options.toggleButtonOffsetX});
			
			this.$itemIndex = 0;
			this.$target.show();
			this.updateSelection();
		}else{
			if(showCommentIfNoResult){
				//사용중임 메시지 레이어 보여줌.
				this.$comment.css({'top': pos.top + this.options.dropdownOffsetY + this.$element.outerHeight(true), 'left': pos.left + this.options.dropdownOffsetX});
				this.$comment.show();
			}else{
				//console.log("no list, no show");
				return;
			}
		}
		
		this.$dataToggle.removeClass(KEYWORD_SUGGEST_CLOSE_CLASS);
		this.$dataToggle.addClass(KEYWORD_SUGGEST_OPEN_CLASS);
		this.$dataToggle.find("img").attr("src", this.options.toggleButtonOpenImg);
		this.$dataToggle.find("img").attr("title", "자동완성 접기");
		this.$dataToggle.find("img").attr("alt", "자동완성 접기");
		
	};

	KeywordSuggest.prototype.hide = function() {
		var startEvent = $.Event('hide.fg.keywordSuggest');
		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented())
			return;
		
		this.$itemIndex = 0;
		this.$target.hide();
		this.$comment.hide();
		this.$dataToggle.removeClass(KEYWORD_SUGGEST_OPEN_CLASS);
		this.$dataToggle.addClass(KEYWORD_SUGGEST_CLOSE_CLASS);
		this.$dataToggle.find("img").attr("src", this.options.toggleButtonCloseImg);
		this.$dataToggle.find("img").attr("title", "자동완성 펼치기");
		this.$dataToggle.find("img").attr("alt", "자동완성 펼치기");
	};

	KeywordSuggest.prototype.toggle = function(showCommentIfNoResult) {
		if(this.isOpened()){
			this.hide();
		}else if(this.isClosed()){
			this.show(showCommentIfNoResult);
		}
	};

	KeywordSuggest.prototype.enable = function() {
		var startEvent = $.Event('enable.fg.keywordSuggest');
		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented())
			return;
			
		deleteCookie(KEYWORD_SUGGEST_COOKIE_NAME);
		this.$enabled = true;
	};
	
	KeywordSuggest.prototype.disable = function() {
		var startEvent = $.Event('disable.fg.keywordSuggest');
		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented())
			return;
		
		setCookie(KEYWORD_SUGGEST_COOKIE_NAME, KEYWORD_SUGGEST_DISABLED, 365);
		this.$enabled = false;
	};
	
	

	function setCookie(cookieName, value, expireDays) {
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() + expireDays);
		var cookieValue = escape(value)
				+ ((expireDays == null) ? "" : "; expires=" + expireDate.toUTCString());
		document.cookie = cookieName + "=" + cookieValue;
	}

	function getCookie(cookieName) {
		var cookieValue = document.cookie;
		var startIndex = cookieValue.indexOf(" " + cookieName + "=");
		if (startIndex == -1) {
			startIndex = cookieValue.indexOf(cookieName + "=");
		}
		if (startIndex == -1) {
			cookieValue = null;
		} else {
			startIndex = cookieValue.indexOf("=", startIndex) + 1;
			var endIndex = cookieValue.indexOf(";", startIndex);
			if (endIndex == -1) {
				endIndex = cookieValue.length;
			}
			cookieValue = unescape(cookieValue.substring(startIndex, endIndex));
		}
		return cookieValue;
	}

	function deleteCookie(cookieName) {
		var expireDate = new Date();

		// 어제 날짜를 쿠키 소멸 날짜로 설정한다.
		expireDate.setDate(expireDate.getDate() - 1);
		document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	}
	
	// TAB PLUGIN DEFINITION
	// =====================

	var old = $.fn.keywordSuggest;

	$.fn.keywordSuggest = function(option) {
		
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.keywordSuggest');
			var options = typeof option == 'object' && option;

			if (!data){
				$this.data('bs.keywordSuggest', (data = new KeywordSuggest(this, options)));
			}
			
			if (typeof option == 'string'){
				data[option]();
			}
		});
		
	};

	$.fn.keywordSuggest.Constructor = KeywordSuggest;

	// TAB NO CONFLICT
	// ===============

	$.fn.keywordSuggest.noConflict = function() {
		$.fn.keywordSuggest = old;
		return this;
	};

}(window.jQuery);
