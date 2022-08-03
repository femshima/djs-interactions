import { ButtonStyle } from 'discord.js';
import { Button } from '../../src';

export default class Link extends Button {
  constructor() {
    super({
      url: 'https://example.com',
      label: 'Link',
      style: ButtonStyle.Link,
    });
  }
}
