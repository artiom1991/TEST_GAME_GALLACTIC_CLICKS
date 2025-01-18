import { _decorator, Component, director } from 'cc';
import {GameManager} from "./GameManager";
const { ccclass } = _decorator;


/**
 * Класс для управления оконной логикой завершения игры.
 * Этот класс отвечает за действия при завершении игры: перезапуск игры и возврат в главное меню.
 */
@ccclass('EndGameWindowManager')
export class EndGameWindowManager extends Component {


    /**
     * Метод для перезапуска игры.
     * Находит компонент `GameManager` на сцене и вызывает метод перезапуска игры.
     */
    private restartGame() {
        let gameManager = director.getScene().getChildByName("GameManager").getComponent(GameManager);
        gameManager.restartGame();
    }


    /**
     * Метод для перехода в главное меню.
     * Загружает сцену главного меню и отменяет все запланированные задачи.
     */
    private mainMenu() {
        director.loadScene("MainMenuScene");
        this.unscheduleAllCallbacks();
    }

}


