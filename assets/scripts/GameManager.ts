import { _decorator, Component, Node, Prefab, instantiate, director } from 'cc';
import { input, Input, EventMouse, KeyCode } from 'cc';
import { RigidBody2D, Label, AudioSource, sys } from 'cc';

const { ccclass, property } = _decorator;

interface UserData {  bestScore: number; }


/**
 * Класс, отвечающий за управление игрой.
 * Включает в себя логику для счёта, таймера, а также паузы и завершения игры.
 */
@ccclass('GameManager')
export class GameManager extends Component {


    /**
     * Этот метод вызывается при загрузке компонента.
     * Он инициализирует основные элементы игры, такие как сцена, таймер, данные пользователя и привязка событий.
     */
    onLoad() {
        this.canvas = director.getScene().getChildByName("Canvas");
        this.schedule(this.updateTimer, 1);
        this.randomSchedule();
        this.loadUserData();

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        director.resume();
    }


    /**
     * Этот метод вызывается при уничтожении компонента.
     * Здесь производится очистка ресурсов и отмена подписок на события.
     */
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }


    /* Создаёт звезду с случайными физическими свойствами и позициями. */
    private generateStar () : void {
        let star = instantiate(this.star);
        let rigidBody = star.getComponent(RigidBody2D);

        rigidBody.gravityScale = this.generateRandomNumber(2, 1, false);
        rigidBody.angularVelocity = this.generateRandomNumber(5, 0, false);

        star.setParent(this.canvas);
        star.setPosition(this.generateRandomNumber(350, 0, true), 900);
        star.setSiblingIndex(4);

        star.on(Node.EventType.MOUSE_DOWN, this.onStarClicked, this);
        star.on(Node.EventType.TOUCH_START, this.onStarClicked, this);

        this.scheduleOnce(() => this.destroyNode(star), 3);
    }


    /* Планирует создание звезды через случайный промежуток времени. */
    private randomSchedule() {
        this.scheduleOnce(() => {
            this.generateStar();
            this.randomSchedule();
        }, this.generateRandomNumber(0.5, 0.5, false));
    }


    /* Генерирует случайное число с учётом множителя, смещения и опции знака. */
    private generateRandomNumber(multiplier: number, offset: number = 0, signed:boolean = false): number {
        let randomSign  = Math.random() > 0.5 ? 1: -1;
        let number = Math.random() * multiplier + offset;
        return signed ? number * randomSign : number;
    }


    /* Уничтожает указанный узел, если он действителен. */
    private destroyNode(node:Node) {
        if(node && node.isValid)
            node.destroy();
    }


    /* Увеличивает текущий счёт на 1 и обновляет текстовое поле для отображения нового значения. */
    private updateScore() {
        this.scoreLabel.string = `Score: ${++this.scoreValue}`;
    }


    /**
     * Обновляет таймер и отображает оставшееся время.
     * Когда таймер достигает 0, останавливает обновление и вызывает конец игры.
    */
    private updateTimer():void {
        if(this.timerValue > 0){
            this.timerLabel.string = `Timer: ${--this.timerValue}`;
            return;
        }

        this.unschedule(this.updateTimer);
        this.endGame();
    }


    /**
     * Обрабатывает нажатие клавиши на клавиатуре.
     * Если нажата клавиша ESCAPE, переключает состояние игры между паузой и продолжением.
     */
    private onKeyDown(event: { keyCode: KeyCode }) {
        if(event.keyCode === KeyCode.ESCAPE)
            this.isGamePaused ? this.resumeGame() : this.pauseGame();
    }


    /**
     * Обрабатывает событие клика на звезду.
     * Если игра не на паузе, проигрывает звук, обновляет счёт и уничтожает объект звезды.
     */
    private onStarClicked(event: EventMouse) {
        if (this.isGamePaused) return;

        this.disappearanceSong.play();
        this.updateScore();
        event.target.destroy();
    }


    /**
     * Обновляет данные пользователя в локальном хранилище.
     * Сохраняет текущий лучший счёт в `localStorage` под ключом `userData`.
     */
    private updateUserData() {
        sys.localStorage.setItem('userData', JSON.stringify({"bestScore": this.scoreValue}))
    }


    /**
     * Загружает данные пользователя из локального хранилища.
     * Если данные пользователя существуют, извлекает лучший счёт и присваивает его значению `bestScoreValue`.
     * Если данные отсутствуют, создаёт их, вызвав `updateUserData`.
     */
    private loadUserData() {
        let userData:UserData = JSON.parse(sys.localStorage.getItem('userData'));
        userData ? this.bestScoreValue = userData.bestScore : this.updateUserData();
    }


    /**
     * Ставит игру на паузу.
     * Приостанавливает обновление игрового процесса, активирует окно паузы и отменяет все запланированные колбэки.
     */
    private pauseGame() {
        director.pause();
        this.isGamePaused = true;
        this.pauseWindow.active = true;
        this.unscheduleAllCallbacks();
    }


    /**
     * Завершает игру.
     * Приостанавливает игровой процесс, обновляет лучший счёт, отображает текущий и лучший счёт,
     * активирует окно завершения игры и отменяет все запланированные колбэки.
     */
    private endGame() {
        director.pause();
        this.bestScoreValue < this.scoreValue ? this.updateUserData() : null;
        this.currentScoreLabel.string = `Score: ${this.scoreValue}`;
        this.bestScoreLabel.string = `Best score: ${this.bestScoreValue}`;
        this.isGamePaused = true;
        this.endGameWindow.active = true;
        this.unscheduleAllCallbacks();
    }


    /**
     * Возобновляет игровой процесс после паузы.
     * Снимает паузу, скрывает окно паузы, перезапускает таймер и генерацию звёзд, а также продолжает игровой цикл.
     */
    public resumeGame() {
        this.isGamePaused = false;
        this.pauseWindow.active = false;
        this.randomSchedule();
        this.schedule(this.updateTimer, 1);
        director.resume();
    }


    /**
     * Перезапускает игру.
     * Перезагружает текущую игровую сцену, сбрасывая всё её состояние.
     */
    public restartGame() {
        director.loadScene("GameScene");
    }


    /* Префаб звезды, используемый для генерации игровых объектов. */
    @property(Prefab)
    star: Prefab;

    /* Метка для отображения текущего счёта. */
    @property(Label)
    scoreLabel: Label;

    /* Метка для отображения лучшего счёта. */
    @property(Label)
    bestScoreLabel: Label;

    /* Метка для отображения финального счёта в окне завершения игры. */
    @property(Label)
    currentScoreLabel: Label;

    /* Метка для отображения оставшегося времени. */
    @property(Label)
    timerLabel: Label;

    /* Метка, связанная с отображением состояния паузы. */
    @property(Label)
    pauseLabel: Label;

    /* Аудиоисточник для воспроизведения звука при клике на звезду. */
    @property(AudioSource)
    disappearanceSong: AudioSource;

    /* Узел окна паузы, отображаемого при остановке игры. */
    @property(Node)
    pauseWindow: Node;

    /* Узел окна завершения игры. */
    @property(Node)
    endGameWindow: Node;

    /* Узел сцены, используемый как родитель для создаваемых объектов. */
    canvas: Node = null;

    /* Текущее значение счёта игрока. */
    scoreValue: number = 0;

    /* Лучший счёт игрока, сохранённый из предыдущих сессий. */
    bestScoreValue: number = 0;

    /* Текущее значение таймера (в секундах). */
    timerValue: number = 60;

    /* Флаг, указывающий, находится ли игра на паузе. */
    isGamePaused: boolean = false;

}
