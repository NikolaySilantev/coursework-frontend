import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import MDEditor from '@uiw/react-md-editor';
import reviewService from "../services/review.service";
import '../styles.css'
import Dropzone from "react-dropzone-uploader";
import imageService from "../services/image.service";
import { WithContext as ReactTags } from 'react-tag-input';

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
        this.handleDeleteTag=this.handleDeleteTag.bind(this);
        this.handleAddTag=this.handleAddTag.bind(this);
        this.handleDragTag=this.handleDragTag.bind(this);
        this.handleClickTag=this.handleClickTag.bind(this);

        this.state = {
            title: "",
            subject: "",
            full_text: "",
            loading: false,
            message: "",
            successful: false,
            images:[],
            imageUrls:[],
            tags:[]
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
                reviewService.postReview(this.state.title, this.state.subject, this.state.full_text, this.state.imageUrls, this.state.tags).then(
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

    handleDeleteTag (i) {
        this.setState({tags: this.state.tags.filter((tag, index) => index !== i)})
    }

    handleAddTag (tag) {
        this.setState({tags : [...this.state.tags, tag]});
    }

    handleDragTag(tag, currPos, newPos) {
        const newTags = this.state.tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState({tags: newTags});
    }

    handleClickTag(index) {
        console.log('The tag at index ' + index + ' was clicked');
    };


    render() {
        const handleChangeStatus = ({ meta, file }, status) => {
            console.log(status, meta, file)
            if (status==="done")
            this.setState(
                {images: [...this.state.images, file]}
            )
            else if (status==="removed")
            this.removeImage(file);
        }
        const KeyCodes = {
            comma: 188,
            enter: 13
        };
        const delimiters = [KeyCodes.comma, KeyCodes.enter];
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
                                autoFocus={true}
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
                            <label htmlFor="tags">Tags</label>
                            <div className="app">
                                <div>
                                    <ReactTags
                                        classNames={{
                                            tags: 'tagsClass',
                                            tagInput: 'tagInputClass',
                                            tagInputField: 'form-control',
                                            selected: 'selectedClass',
                                            tag: 'tagClass',
                                            remove: 'removeClass',
                                            suggestions: 'suggestionsClass',
                                            activeSuggestion: 'activeSuggestionClass',
                                            editTagInput: 'editTagInputClass',
                                            editTagInputField: 'editTagInputField',
                                            clearAll: 'clearAllClass',
                                        }}
                                        tags={this.state.tags}
                                        delimiters={delimiters}
                                        handleDelete={this.handleDeleteTag}
                                        handleAddition={this.handleAddTag}
                                        handleDrag={this.handleDragTag}
                                        handleTagClick={this.handleClickTag}
                                        inputFieldPosition="bottom"
                                        autocomplete
                                        autofocus={false}
                                        validations={[required]}
                                    />
                                </div>
                            </div>
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