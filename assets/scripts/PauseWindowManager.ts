import { _decorator, Component, director } from 'cc';
import {GameManager} from "./GameManager";
const { ccclass } = _decorator;



/**
 * Класс, управляющий логикой окна паузы в игре.
 * Этот класс управляет поведением окна паузы, например, возобновлением игры или переходом в главное меню.
 */
@ccclass('PauseWindowManager')
export class PauseWindowManager extends Component {

    /**
     * Метод для возобновления игры.
     * Он получает компонент GameManager из текущей сцены и вызывает метод resumeGame для продолжения игры.
     */
    private resumeGame() {
        let gameManager = director.getScene().getChildByName("GameManager").getComponent(GameManager);
        gameManager.resumeGame();
    }


    /**
     * Метод для возврата в главное меню.
     * Загружает сцену "MainMenuScene" и останавливает все запланированные действия.
     */
    private mainMenu() {
        director.loadScene("MainMenuScene");
        this.unscheduleAllCallbacks();
    }

}


