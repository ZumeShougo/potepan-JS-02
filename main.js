$(document).ready(function () {
  let currentInput = ""; // 画面に表示される入力内容

  $(".wrapper button").on("click", function () {
    const buttonValue = $(this).data("value");

    /*----- `AC` ボタンが押されたとき（リセット）------*/
    if (buttonValue === "AC") {
      currentInput = "";
      $("#result").text("");
      return;
    }
    /*------------------------------------------------*/

    /*-----------`=` ボタンが押されたとき（計算処理）-------*/
    if (buttonValue === "=") {
      try {
        let result = calculateExpression(currentInput);
        $("#result").text(result);
        currentInput = result.toString();
      } catch (error) {
        $("#result").text("Error");
        currentInput = "";
      }
      return;
    }
    /*---------------------------------------------------- */

    /* ------------ボタンを押したら表示部に加えていく------*/
    currentInput += buttonValue;
    $("#result").text(currentInput);
    /*---------------------------------------------------- */
  });


  // **演算子の優先順位を考慮した計算関数**
  function calculateExpression(expression) {
    try {
      let numbers = expression.split(/[\+\-\*\/]/).map(num => parseFloat(num));
      //expressionを各演算子で区切ったものを抽出して配列化し、.mapで抽出したものを数字似直して再配列化した。
      let operators = expression.split("").filter(char => ["+", "-", "*", "/"].includes(char));
      // filterをつかって演算子だけを抽出した。
      //ここまでで、numbersには数字のみの配列、operatorsには演算子のみの配列がそれぞれ格納された。

      if (numbers.some(num => isNaN(num))) throw new Error("Invalid Input");
      //数字ではない(Not a Number)のとき計算を中止してerrorを返す。

      /*乗算・除算を処理*/
      for (let i = 0; i < operators.length; i++) {
        if (operators[i] === "*" || operators[i] === "/") {
          let result = operators[i] === "*"
            ? numbers[i] * numbers[i + 1]
            : numbers[i] / numbers[i + 1];
            // 三項演算子を使って*ならi番目とi番目の次の数字を掛け算する。違うなら割り算する。
          numbers.splice(i, 2, result);
          // 配列i番目から2個の要素を削除して計算結果をそこに置換する
          operators.splice(i, 1); // 演算子配列のi番目を削除する。
          i--; // 配列を詰めたので `i` を調整
        }
      }

      /*残った加算・減算を処理 finalResultを更新し続けることで式の左から順に足し引きを実行する*/
      let finalResult = numbers[0];
      for (let i = 0; i < operators.length; i++) {
        finalResult = operators[i] === "+"
          ? finalResult + numbers[i + 1]
          : finalResult - numbers[i + 1];
      }
      return finalResult;
    } catch (error) {
      return "Error";
    }
  }
});
