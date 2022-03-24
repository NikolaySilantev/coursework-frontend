import React, { Component } from "react";

export default class ImageCarouselComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            carouselId:0
        };
    }

    componentDidMount() {
        this.setState({
            images: this.props.images,
            carouselId: this.props.carouselId
        })
    }

    render() {
        const images = this.state.images;
        const key = this.state.carouselId;
        return (
            <span>
                {this.state.images.length!==0 && (
                    <div className="mt-2">
                    <div id={"carouselExampleIndicators" + key} className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {images.map((image, index) =>
                                (index === 0 && <button key={index} type="button"
                                                        data-bs-target={"#carouselExampleIndicators" + key}
                                                        data-bs-slide-to={index}
                                                        className="active" aria-current="true"
                                                        aria-label={"Slide " + index + 1}/>)
                                ||
                                (<button key={index} type="button" data-bs-target={"#carouselExampleIndicators" + key}
                                         data-bs-slide-to={index}
                                         aria-label={"Slide " + index + 1}/>)
                            )}
                        </div>
                        <div className="carousel-inner">
                            {images.map((image, index) =>
                                (index === 0 && <div key={index} className="carousel-item active">
                                    <img src={image} alt="..."/>
                                </div>)
                                ||
                                (<div key={index} className="carousel-item">
                                    <img src={image} alt="..."/>
                                </div>)
                            )}
                        </div>
                        <button className="carousel-control-prev" type="button"
                                data-bs-target={"#carouselExampleIndicators" + key} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon bg-secondary rounded" aria-hidden="true"/>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button"
                                data-bs-target={"#carouselExampleIndicators" + key} data-bs-slide="next">
                            <span className="carousel-control-next-icon bg-secondary rounded" aria-hidden="true"/>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>)}
            </span>
        );
    }
}
