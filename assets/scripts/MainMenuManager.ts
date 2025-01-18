import { _decorator, Component, director, Label, sys} from 'cc';
import {GameManager, UserData} from "./GameManager";
const { ccclass, property } = _decorator;


/**
 * Класс для управления главным меню игры.
 * Этот класс отвечает за отображение лучшего счёта на главном экране и старт игры.
 */
@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    /** Метка для отображения лучшего счёта. */
    @property(Label)
    bestScore: Label;


    /**
     * Метод, вызываемый при загрузке компонента.
     * Загружает данные пользователя и обновляет лучший счёт в главном меню.
     */
    onLoad() {
        this.loadUserData();
    }


    /**
     * Метод для начала игры.
     * Перезагружает сцену и переключается на сцену игры.
     */
    private startGame() {
        director.loadScene("GameScene");
    }


    /**
     * Метод для загрузки данных пользователя из локального хранилища.
     * Если данные пользователя существуют, отображается лучший счёт.
     */
    private loadUserData() {
        let userData:UserData = JSON.parse(sys.localStorage.getItem('userData'));
        userData ? this.bestScore.string = `Best score: ${userData.bestScore}` : null;
    }
}


