window.addEventListener('DOMContentLoaded', function () {
    let md = document.getElementById('editor');
    
    // 現在編集中であることを示すフラグ
    let editFlag = 0;

    // PlantUMLのURLの取得
    let getURL = (sauce) => {
        
        return "http://www.plantuml.com/plantuml/svg/" + plantumlEncoder.encode(sauce);
    };
    // 更新が発生したこと検知
    let editDetection = (e) => {

        if (editFlag) clearTimeout(editFlag);
        editFlag = 0;
    };
    // undo, redoの検知
    let undoRedoDetection = (e) => {

        if (e.ctrlKey && ['z', 'y'].includes(e.key)) {
            editDetection(e);
            applyingUpdate(e);
        }
    };
    // 更新の適用
    let applyingUpdate = (e) => {
        
        // BackspaceとDeleteキーの入力もOK(文字キー+Enterキーはkeypressイベントで取得する)
        if (!editFlag || editFlag >= 1 && editFlag <= 4294967295 || e.keyCode == 46 || e.keyCode == 8) {
            editFlag = setTimeout(() => {
                
                document.getElementById('view').src = getURL(document.getElementById('editor').value);
            }, 1000);
        }
    };
    md.addEventListener('input', applyingUpdate); // inputイベントをキャッチしてapplyingUpdateを実行
    md.addEventListener('keypress', editDetection);
    md.addEventListener('paste', editDetection);
    md.addEventListener('cut', editDetection);
    md.addEventListener('keydown', undoRedoDetection);
    md.addEventListener('keyup', applyingUpdate);
});