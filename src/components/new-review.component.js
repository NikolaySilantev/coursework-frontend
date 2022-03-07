import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import MDEditor from '@uiw/react-md-editor';
import reviewService from "../services/review.service";
import MyUploader from "./dropzone.component";
import Dropzone from "react-dropzone-uploader";
import imageService from "../services/image.service";
const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};
export default class NewReview extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onChangeFull_text = this.onChangeFull_text.bind(this);
        this.handlePostReview = this.handlePostReview.bind(this);

        this.state = {
            title: "",
            subject: "",
            full_text: "",
            loading: false,
            message: "",
            successful: false,
            images:[],
            imageUrls:[]
        };
    }
    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }
    onChangeSubject(e) {
        this.setState({
            subject: e.target.value
        });
    }
    onChangeFull_text(value) {
        this.setState({
            full_text: value
        });
    }

    handlePostReview(e) {
        e.preventDefault();
        this.setState({
            message: "",
            loading: true,
            successful: false
        });
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            let promises = [];
            this.state.images.map(img => {
                promises.push(
                    imageService.upload(img).then(response => {
                        this.state.imageUrls.push(response.data.url)
                    })
                )
            })
            Promise.all(promises).then(() => {
                reviewService.postReview(this.state.title, this.state.subject, this.state.full_text, this.state.imageUrls).then(
                    (response) => {
                        this.setState({
                            message: response.data.message,
                            loading: false,
                            successful: true
                        });
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        this.setState({
                            loading: false,
                            successful: false,
                            message: resMessage
                        });
                    }
                );
            });

        } else {
            this.setState({
                loading: false
            });
        }
    }

    removeImage(file) {
        this.setState({images: this.state.images.filter(function(img) {
                return img !== file
            })});
    }

    render() {
        const handleChangeStatus = ({ meta, file }, status) => {
            console.log(status, meta, file)
            if (status=="done")
            {this.setState(
                {images: [...this.state.images, file]}
            )
                console.log("privet");}
            else if (status=="removed")
            {this.removeImage(file);
                console.log("poka");}
        }
        return (
            <div className="container mt-5 mb-5">
                    <Form
                        onSubmit={this.handlePostReview}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="title"
                                value={this.state.title}
                                onChange={this.onChangeTitle}
                                validations={[required]}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="subject"
                                value={this.state.subject}
                                onChange={this.onChangeSubject}
                                validations={[required]}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="full_text">Full text</label>
                            <MDEditor
                                name="full_text"
                                value={this.state.full_text}
                                onChange={this.onChangeFull_text}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="images">Put some images</label>
                            <Dropzone
                                name="images"
                                accept="image/*"
                                onChangeStatus={handleChangeStatus}
                                SubmitButtonComponent={null}
                                autoUpload={false}
                            />
                        </div>
                        <div className="form-group mt-2">
                            <button
                                className="btn btn-primary btn-block"
                                disabled={this.state.loading}
                            >
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Post review</span>
                            </button>
                        </div>
                        {this.state.message && (
                            <div className="form-group">
                                <div className={
                                    this.state.successful
                                        ? "alert alert-success"
                                        : "alert alert-danger"
                                } role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
            </div>
        );
    }
}