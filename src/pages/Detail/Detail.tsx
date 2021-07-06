import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import DetailBase from './DetailBase';
import {DetailsProps} from './DetailProps';

const Detail: FC<RouteComponentProps<DetailsProps>> = (props) => {
  return <DetailBase dataset={props.match.params.dataset || ''} model={props.match.params.model || ''} />;
};

export default observer(Detail);
