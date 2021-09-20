import { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import DetailBase from './DetailBase';
import { DetailsProps } from './DetailProps';

const Detail: FC<RouteComponentProps<DetailsProps>> = (props) => (
  <DetailBase dataset={props.match.params.dataset || ''} model={props.match.params.model || ''} />
);

export default observer(Detail);
