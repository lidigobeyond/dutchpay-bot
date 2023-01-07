import dayjs from 'dayjs';
import { ViewState } from '../../slack/dto/payloads/block-actions-payload.dto';
import { StateOfPlainTextInputElement } from '../../slack/dto/block-elements/plain-text-input-element.dto';
import { StateOfDatePickerElement } from '../../slack/dto/block-elements/date-picker-element.dto';
import { DutchPayParticipant } from './dutch-pay-modal.dto';

interface DutchPayModalStateArgs {
  title?: string;
  datetime?: dayjs.Dayjs;
  description?: string;
  participants: DutchPayParticipant[];
}

export class DutchPayModalState {
  public readonly title?: string;
  public readonly datetime?: dayjs.Dayjs;
  public readonly description?: string;
  public readonly participants: DutchPayParticipant[];

  private constructor(args: DutchPayModalStateArgs) {
    const { title, datetime, description, participants } = args;

    this.title = title;
    this.datetime = datetime;
    this.description = description;
    this.participants = participants;
  }

  static fromViewState(viewState: ViewState): DutchPayModalState {
    const { values } = viewState;

    const title = (values.title.title as StateOfPlainTextInputElement).value;
    const datetime = (values.datetime.datetime as StateOfDatePickerElement).selected_date;
    const description = (values.description.description as StateOfPlainTextInputElement).value;
    const participants: DutchPayParticipant[] = Object.keys(values)
      .filter((key) => key.startsWith('participants/'))
      .map((key) => {
        const userId = key.split('/')[1];
        const price = (values[key].price as StateOfPlainTextInputElement).value;

        return {
          id: userId,
          price,
        };
      });

    return new this({ title, datetime: dayjs(datetime), description, participants });
  }
}
