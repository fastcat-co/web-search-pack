/*
 * 문자열 일치도 비교하기
 *
 * 2016-01-07
 *
 * Original: https://github.com/joshaven/string_score
 * */

String.prototype.score = function(keyword) {

    if (string == keyword) { return 1.0; }

    if (keyword == "") { return 0; }

    var total_character_score = 0,
        keyword_length = keyword.length,
        string = this,
        string_length = string.length,
        compare_score = 0,
        final_score;

    for (var i = 0; i < string_length; ++i) {

        var c = string[i];
        var index_c_lowercase = keyword.indexOf(c.toLowerCase());
        var index_c_uppercase = keyword.indexOf(c.toUpperCase());
        var min_index = Math.min(index_c_lowercase, index_c_uppercase);
        var index_in_string = (min_index > -1) ? min_index : Math.max(index_c_lowercase, index_c_uppercase);

        if (keyword[index_in_string] === c) {
            compare_score++;
        }
    }

    /* 일치도 : (일치하는 문자 수) / (자동검색 키워드 길이) */
    final_score = compare_score / string_length;

    return final_score;
};