/**
 * Provides an abstract base class for incoming socket messages
 * to inherit from. This class is not meant to be used on its own,
 * but rather extended by further message types.
 * 
 * This is primarily just used to share editorially-correct date
 * formatting methods, but would be a good place to put other
 * institution-specific utilities.
 * 
 * @export
 * @class MessageBase
 */
export class MessageBase {
  /**
   * Static list of month names in 0-11 indexed order.
   * 
   * @private
   * @static
   */
  private static months = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];
  /**
   * Changes a valid date string (i.e. one that that can be used
   * in a `new Date()` instance) into OT-friendly formatting. See
   * the [brand.ontariotechu.ca](1) page on date formatting.
   * 
   * [1]: https://brand.ontariotechu.ca/documentation-and-guides/editorial-style-guide/style-guidelines/dates.php
   * 
   * @protected
   * @param {string} dateString 
   * @returns {string}
   */
  protected formatDate?(dateString: string): string {
    const date = new Date(dateString);
    return [
      MessageBase.months[date.getMonth()],
      ' ', date.getDate(),
      ', ', date.getFullYear(),
      ' ', this.leadingZero(date.getHours()),
      ':', this.leadingZero(date.getMinutes())
    ].join('');
  }
  /**
   * Prepends a zero to the beginning of a number if it would equal
   * less than two digits, i.e. 1-9 become 01-09.
   * 
   * @protected
   * @param {number} number 
   * @returns {string}
   */
  protected leadingZero?(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
  }
  /**
   * Grabs individual properties from an object by name and gives
   * back an object with only those properties.
   * 
   * @protected
   * @template T Original object
   * @template K Key of original object
   * @param {T} obj Object from which to pluck
   * @param {K[]} props Array of property names to pluck
   * @returns {Partial<T>}
   */
  protected pluck?<T, K extends keyof T>(obj: T, props: K[]): Partial<T> {
    return props.reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {} as Partial<T>);
  }
}