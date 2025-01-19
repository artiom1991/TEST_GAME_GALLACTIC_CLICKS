import { _decorator, Component, director, Scene, Node } from 'cc';
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
    private restartGame() :void {
        const scene:Scene = director.getScene();
        const gameManager:Node = scene.getChildByName("GameManager");
        const gameManagerComponent:GameManager = gameManager.getComponent(GameManager);
        
        gameManagerComponent.restartGame();
    }


    /**
     * Метод для перехода в главное меню.
     * Загружает сцену главного меню и отменяет все запланированные задачи.
     */
    private mainMenu() :void {
        director.loadScene("MainMenuScene");
        this.unscheduleAllCallbacks();
    }

}


