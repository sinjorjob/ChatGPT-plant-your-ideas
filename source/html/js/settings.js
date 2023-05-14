function display_alert(message, title) {
    // モーダルウィンドウを表示する
    let modal = document.getElementById("alert-modal");
    let alert_message = document.getElementById("alert-modal-message");
    let alert_title = document.getElementById("alert-modal-title");
    alert_title.innerText = title;
    alert_message.innerText = message;
    modal.style.display = "block";
    // モーダルウィンドウの閉じるボタンがクリックされたときに閉じる
    let close = document.getElementsByClassName("alert-modal-close-btn")[0];
    close.onclick = function () {
        modal.style.display = "none";
    }
}

async function loadApiKey() {
    const api_key = await eel.get_api_key()();
    document.getElementById("usernameValidate").value = api_key;
}
loadApiKey();

async function saveApiKey() {
    const api_key = document.getElementById("usernameValidate").value;
    if (api_key.trim() === "") {
        //alert("APIキーが未入力です。");
        display_alert("APIキーが未入力です。", "警告メッセージ")
        return;
    }
    await eel.save_api_key(api_key)();
    display_alert("APIキーが保存されました。", "完了メッセージ");
}
eel.expose(append_alert);
function append_alert(message) {
    //document.getElementById("usernameValidate").value = message;


}