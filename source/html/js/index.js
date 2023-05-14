function display_alert(message){
    // モーダルウィンドウを表示する
    let modal = document.getElementById("alert-modal");
    let alert_message = document.getElementById("alert-modal-message");
    alert_message.innerText = message;
    modal.style.display = "block";
    // モーダルウィンドウの閉じるボタンがクリックされたときに閉じる
    let close = document.getElementsByClassName("alert-modal-close-btn")[0];
    close.onclick = function() {
    modal.style.display = "none";
    }
}
let editFlag = 0; // グローバル変数として定義する
eel.expose(append_textarea);
function append_textarea(message) {
    let responseArea = document.getElementById('editor');
    responseArea.value += message;
    responseArea.dispatchEvent(new Event('input')); // inputイベントを発生させる

}
eel.expose(send_alert);
function send_alert(error_messages) {
    //alert(error_messages);
    display_alert(error_messages)
    setTimeout(function () { overlay.style.display = "none"; }, 500); // ローディング画面を非表示にする（遅延処理）
}
async function chat_gpt() {

    let select = document.getElementById("language");
    let selectedLanguage = select.options[select.selectedIndex].text;
    
    let text_inquiry = document.getElementById("inquiry");
    text_inquiry = text_inquiry.value;
    if (text_inquiry === "") {
      
        // モーダルウィンドウを表示する
        display_alert("入力フォームが空です。")
        return;
      }
    let responseArea = document.getElementById('editor');
    responseArea.value = ""; // textareaの情報を空にする
    editFlag = 0; // chat_gpt関数が呼ばれるたびに初期化する
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block"; // ローディング画面を表示
    await eel.chat_gpt(text_inquiry, selectedLanguage)();
    setTimeout(function () { overlay.style.display = "none"; }, 3000); // ローディング画面を非表示にする（遅延処理）
    // Downloadリンクを表示
    let mindmapArea= document.getElementById("mindmap");
    mindmapArea.style.display = "block";
}

function download_map() {
    // Get the image URL
    var imgUrl = document.getElementById("view").src;

    // Use fetch to download the image
    fetch(imgUrl)
        .then(response => response.blob())
        .then(blob => {
            // Create a new anchor element to trigger the download
            var downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = "mindmap.html";

            // Create a new HTML document
            var htmlDoc = document.implementation.createHTMLDocument();
            // 現在の日時を取得
            let current_datetime = new Date();
            let formatted_date = current_datetime.getFullYear().toString() + (current_datetime.getMonth() + 1).toString().padStart(2, '0') + current_datetime.getDate().toString().padStart(2, '0') + current_datetime.getHours().toString().padStart(2, '0') + current_datetime.getMinutes().toString().padStart(2, '0') + current_datetime.getSeconds().toString().padStart(2, '0') + current_datetime.getMilliseconds().toString().padStart(3, '0');

            // Add the custom HTML code to the new document
            htmlDoc.documentElement.innerHTML = `
            <style>
                .memo-container {
                  display: inline-flex;
                  align-items: center;
                  padding: 10px;
                  background-color: #F5F5F5;
                  border-radius: 5px;
                  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                #memo {
                  min-width: 200px;
                  min-height: 100px;
                  width: 100%;
                  height: 100%;
                  padding: 10px;
                  border: none;
                  border-radius: 3px;
                  margin-right: 10px;
                  font-size: 16px;
                  color: #555;
                  flex: 1;
                  resize: both;
                }
                
                button {
                  background-color: #226af0;
                  color: white;
                  border: none;
                  border-radius: 3px;
                  font-size: 12px;
                  font-weight: bold;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                  padding: 5px 6px;
                  margin-left: 15px;
                  outline: none;
                }
                
                button:hover {
                  background-color: #484ada;
                }
              </style>
                
              <div class="memo-container">
                <textarea id="${formatted_date}" placeholder="メモを追加する" style="width: 400px; height: 150px;"></textarea>
                <button type="button" onclick="saveMemo('${formatted_date}')">メモを保存</button>
              </div>
              <hr>
              <script>
                // メモを保存する関数
                function saveMemo(memoId) {
                  // テキストエリアからメモの内容を取得
                  var memo = document.getElementById(memoId).value;
                  
                  // ローカルストレージにメモを保存
                  localStorage.setItem(memoId, memo);
                  
                  // 保存が完了した旨を表示
                  alert("メモを保存しました。");
                }
                
                // メモを読み込む関数
                function loadMemo(memoId) {
                  // ローカルストレージからメモを読み込む
                  var memo = localStorage.getItem(memoId);
                  
                  // テキストエリアにメモを表示
                  document.getElementById(memoId).value = memo;
                }
                
                // ページが読み込まれた時にメモを読み込む
                window.onload = function() {
                  loadMemo('${formatted_date}');
                }
              <\/script>
            `;

            // Append the image to the new document
            var img = document.createElement("img");
            img.src = imgUrl;
            htmlDoc.body.appendChild(img);

            // Append the new document to the anchor element and trigger the download
            downloadLink.href = URL.createObjectURL(new Blob([htmlDoc.documentElement.outerHTML], {type: "text/html"}));


            // Trigger the download
            downloadLink.click();
        });
}