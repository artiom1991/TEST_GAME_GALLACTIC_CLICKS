import { _decorator, Component, director, Label, sys} from 'cc';
import {UserData} from "./GameManager";

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
    
    /** Лучший счёт игрока, сохранённый из предыдущих сессий. */
    bestScoreValue: number = 0;


    /**
     * Метод, вызываемый при загрузке компонента.
     * Загружает данные пользователя и обновляет лучший счёт в главном меню.
     */
    onLoad() {
        this.loadUserData();
        this.bestScore.string = `Best score: ${this.bestScoreValue}`;
    }


    /**
     * Метод для начала игры.
     * Перезагружает сцену и переключается на сцену игры.
     */
    private startGame() : void {
        director.loadScene("GameScene");
    }


    /**
     * Метод для загрузки данных пользователя из локального хранилища.
     * Если данные пользователя существуют, отображается лучший счёт.
     */
    private loadUserData() : void {
        try {
            const storageData = sys.localStorage.getItem('userData');
            const userData: UserData | null = JSON.parse(storageData);
    
            if (!userData || userData.bestScore === undefined) {
                throw new Error("Разобранные данные равны null, undefined или не содержат bestScore");
            }
    
            this.bestScoreValue = userData.bestScore;

        } catch (error) {
            console.error("Ошибка при загрузке или разборе данных пользователя:", error);
        }
    }
}


