import '../styles/notification.scss';

export type NotificationOptions = Partial<{
  duration: number;
  className: string;
  linkUrl: string;
  position: Partial<{
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  }>,
  disableAnimation: boolean;
  onNotify(): void;
  onDismiss(): void;
  onClick(): void;
}>;

export class ToastNotification {
  static DEFAULTS: NotificationOptions = {
    position: {
      right: true,
      bottom: true
    }
  };

  private _notificationContainer: Element;

  constructor(private _defaults: NotificationOptions = ToastNotification.DEFAULTS) {
    let notificationContainer = document.querySelector('.notification-container');
    console.log(notificationContainer);
    if (!notificationContainer) {
      const notificationClasses = Object.keys(this._defaults.position).reduce((classes, key) => {
        this._defaults.position[key] && classes.push(`notification-${key}`);
        return classes;
      }, []);
      this._defaults.className && notificationClasses.push(this._defaults.className);
      !this._defaults.disableAnimation && notificationClasses.push('animated');
      notificationContainer = document.createElement('div');
      notificationContainer.className = `notification-container ${notificationClasses.join(' ')}`;
      document.body.appendChild(notificationContainer);
    }
    this._notificationContainer = notificationContainer;
  }

  notify(message: string, options: NotificationOptions = {}) {
    const opts = {...this._defaults, ...options};
    const notification = this._getNotification(message, opts);
    this._transitionIn(notification, opts);
    if (opts.duration && opts.duration > 0) {
      setTimeout(() => {
        this._transitionOut(notification, opts);
      }, opts.duration);
    }
    return {
      dismiss: () => this._transitionOut(notification, opts)
    };
  }

  private _getNotification(message: string, options: NotificationOptions = {}) {
    const template = document.createElement('template');
    const className = options.className ? ` ${options.className}` : '';
    const linkHref = options.linkUrl ? ` href="${options.linkUrl}"` : '';
    const outerElement = options.linkUrl ?  'a' : 'div';
    template.innerHTML = `<${outerElement}${linkHref} class="callout notification${className}">
      ${message}
      <button class="close-button" aria-label="Dismiss alert" type="button">
        <span aria-hidden="true">⊗</span>
      </button>
    </${outerElement}>`;
    const notification = template.content.firstChild as Element;
    const closeButton = notification.querySelector('.close-button');
    const closeListener = event => {
      event.preventDefault();
      this._transitionOut(notification, options);
      closeButton.removeEventListener('click', closeListener);
    };
    closeButton.addEventListener('click', closeListener);
    return notification;
  }

  private _transitionIn(notification, options: NotificationOptions = {}) {
    options.onClick && notification.addEventListener('click', options.onClick);
    if (options.disableAnimation) {
      if (options.position.top) {
        this._notificationContainer.prepend(notification);
      } else {
        this._notificationContainer.appendChild(notification);
      }
      options.onNotify && options.onNotify.apply(notification);
    } else {
      if (options.position.left) {
        notification.classList.remove('fadeOutLeft');
        notification.classList.add('fadeInLeft');
      } else {
        notification.classList.remove('fadeOutRight');
        notification.classList.add('fadeInRight');
      }
      if (options.position.top) {
        this._notificationContainer.prepend(notification);
      } else {
        this._notificationContainer.appendChild(notification);
      }
      const animationEnd = () => {
        options.onNotify && options.onNotify.apply(notification);
        notification.removeEventListener('animationend', animationEnd);
      };
      notification.addEventListener('animationend', animationEnd);
    }
  }

  private _transitionOut(notification: Element, options: NotificationOptions = {}) {
    options.onClick && notification.removeEventListener('click', options.onClick);
    if (options.disableAnimation) {
      this._notificationContainer.removeChild(notification);
      options.onDismiss && options.onDismiss.apply(notification);
    } else {
      if (options.position.left) {
        notification.classList.remove('fadeInLeft');
        notification.classList.add('fadeOutLeft');
      } else if (options.position.right) {
        notification.classList.remove('fadeInRight');
        notification.classList.add('fadeOutRight');
      }
      const animationEnd = () => {
        this._notificationContainer.removeChild(notification);
        options.onDismiss && options.onDismiss.apply(notification);
        notification.removeEventListener('animationend', animationEnd);
      };
      notification.addEventListener('animationend', animationEnd);
    }
  }
}